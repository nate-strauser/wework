# Meteor Infinite Scroll
**Enables infinite scrolling at the template level**. This package allows you to increment the `limit` parameter of a MongoDB query as the user scrolls down the page. This allows Meteor to use the Oplog Observe Driver for your query, as well as leaving you in control of your publications.

## Usage:

Call `this.infiniteScroll` in the `created` or `rendered` functions for your template.

```js
Template.comments.created = function() {
  // Enable infinite scrolling on this template
  this.infiniteScroll({
    perPage: 20,                        // How many results to load "per page"
    query: {                            // The query to use as the selector in our collection.find() query
        post: 71
    },
    subManager: new SubsManager(),      // (optional) A meteorhacks:subs-manager to set the subscription on
                                        // Useful when you want the data to persist after this template 
                                        // is destroyed.
    collection: 'Comments',             // The name of the collection to use for counting results
    publication: 'CommentsInfinite'     // (optional) The name of the publication to subscribe.
                                        // Defaults to {collection}Infinite
  });
};
```

Create a publication on the server:

```js
if(Meteor.isServer){
    Meteor.publish('CommentsInfinite', function(limit, query) {
        // Don't use the query object directly in your cursor for security!
        var selector = {};
        check(limit, Number);
        check(query.name, String);
        // Assign safe values to a new object after they have been validated
        selector.name = query.name;

        return app.collections.Comments.find(selector, {
          limit: limit,
          // Using sort here is necessary to continue to use the Oplog Observe Driver!
          // https://github.com/meteor/meteor/wiki/Oplog-Observe-Driver
          sort: {
            created: 1
          }
        });
    });
}
```

Render your data as usual. Render the `{{> infiniteScroll }}` template after your data is rendered:

```handlebars
<template name="comments">
    {{#each comments}}
        {{content}}
    {{/each}}
    {{> infiniteScroll }}
</template>
```
> Infinite Scroll will increase the `limit` of the subscription as the `{{> infiniteScroll }}` template approaches the viewport.

Provide data to the template as you usually would. Use `infiniteReady()` like you would use `subscriptionsReady()` on the template instance.
```js
Template.comments.helpers({
  comments: function() {
    // Don't show anything until the first result set has been received
    if(!Template.instance().infiniteReady()){
      return;
    }
    return app.collections.Comments.find({ post: 71 },  {
        sort: {
            created: 1
        }
    });
  }
});
```

### Only `limit`

Using `skip` will cause Meteor to use the Polling Observe Driver (see [Oplog Observe Driver in the Meteor Wiki](https://github.com/meteor/meteor/wiki/Oplog-Observe-Driver)). For a full pagination solution that uses skip, check out [alethes:pages](https://github.com/alethes/meteor-pages).

## Styling the loader
The `{{> infiniteScroll }}` template renders:
```html
<template name="infiniteScroll">
  <div class="infinite-load-more">
    <div class="infinite-label">
      Loading...
    </div>
  </div>
</template>
```

When the subscription is loading more data, `.infinite-load-more` will receive the class `loading`. It will be removed when the subscription is marked as ready.

`.infinite-label` is only visible when the subscription is loading.

# Todo:
- Customizable loading template
- Customizable threshold for loading more results