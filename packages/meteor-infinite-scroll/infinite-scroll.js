'use strict';

/**
 * Triggers 'triggerInfiniteLoad' event when the user has scrolled
 * to the trigger point.
 */
function triggerLoadMore() {
  if ($('.infinite-load-more').isAlmostVisible()) {
    $(document).trigger('triggerInfiniteLoad');
  }
}

/**
 * Attempt to trigger infinite loading when resize and scroll browser
 * events are fired.
 */
Meteor.startup(function() {
  $(window).on('resize scroll', _.throttle(triggerLoadMore, 500));
});


/**
 * Attempt to trigger infinite loading when the route changes.
 */
Router.onAfterAction(function() {
  triggerLoadMore();
});

/**
 * jQuery plugin to determine whether an element is "almost visible".
 * @return {Boolean}
 */
jQuery.fn.isAlmostVisible = function jQueryIsAlmostVisible() {
  if (this.length === 0) {
    return;
  }
  var rect = this[0].getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (jQuery(window).height() * 2) &&
    rect.right <= jQuery(window).width()
  );
};

/**
 * Enable infinite scrolling on a template.
 */
Blaze.TemplateInstance.prototype.infiniteScroll = function infiniteScroll(options) {
  var tpl = this, _defaults, collection, subManagerCache, limit, subscriber, firstReady, loadMore;

  /*
   * Create options from defaults
   */
  _defaults = {
    // How many results to fetch per "page"
    perPage: 10,
    // The query to use when fetching our collection
    query: new ReactiveVar({}),
    // The subscription manager to use (optional)
    subManager: null,
    // Collection to use for counting the amount of results
    collection: null,
    // Publication to subscribe to, if null will use {collection}Infinite
    publication: null
  };
  options = _.extend({}, _defaults, options);

  // Validate the options
  check(options.perPage, Number);
  //check(options.collection, Object);
  check(options.publication, String);

  // Collection exists?
  if (!options.collection) {
    throw new Error('Collection does not exist: ', options.collection);
  }

  // Generate the publication name if one hasn't been provided
  if(!options.publication){
    options.publication = options.collection + 'Infinite';
  }
  collection = options.collection;

  // If we are using a subscription manager, cache the limit variable with the subscription
  if(options.subManager){
    // Create the cache object if it doesn't exist
    if(!options.subManager._infinite){
      options.subManager._infinite = {};
      options.subManager._infinite[options.publication] = {};
    }
    subManagerCache = options.subManager._infinite[options.publication];
  }

  // We use 'limit' so that Meteor can continue to use the OpLogObserve driver
  // See: https://github.com/meteor/meteor/wiki/Oplog-Observe-Driver
  // (There are a few types of queries that still use PollingObserveDriver)
  limit = new ReactiveVar();

  // Retrieve the initial page size
  if(subManagerCache && subManagerCache.limit){
    limit.set(subManagerCache.limit);
  }else{
    limit.set(options.perPage);
  }


  // Create subscription to the collection
  tpl.autorun(function() {
    // Rerun when the limit changes
    var lmt = limit.get();

    // If a Subscription Manager has been supplied, use that instead to create
    // the subscription. This is useful if you want to keep the subscription
    // loaded for multiple templates.
    if(options.subManager){
      subscriber = options.subManager;
      // Save the limit in the subscription manager so we can look it up later
      if(subManagerCache)
        subManagerCache.limit = lmt;
    }else{
      subscriber = tpl;
    }

    tpl.infiniteSub = subscriber.subscribe(options.publication, lmt, options.query.get());
  });

  // Create infiniteReady reactive var that we can use to track
  // whether or not the first result set has been received.
  firstReady = new ReactiveVar(false);
  tpl.infiniteReady = function(){
    return firstReady.get() === true;
  };

  // Set infiniteReady to true when our subscription is ready
  tpl.autorun(function(){
    var ready = tpl.infiniteSub.ready();
    if(firstReady.get() !== true){
      firstReady.set(ready);
    }
  });

  /**
   * Load more results for this collection.
   */
  loadMore = function() {
    var count = collection.find({}, {
      reactive: false
    }).count();

    // Increase the limit if it looks like there are more records
    if (count >= limit.get()) {
      tpl.$('.infinite-load-more').addClass('loading');
      limit.set(limit.get() + options.perPage);
    }else{
      tpl.$('.infinite-load-more').removeClass('loading');
    }
  };

  // Trigger loadMore when we've scrolled/resized close to revealing .load-more
  $(document).off('triggerInfiniteLoad');
  $(document).on('triggerInfiniteLoad', loadMore);
};
