daysUntilExpiration = function() {
    var daysToWait = 1;
    var daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate()-daysToWait);
    return daysAgo;
}