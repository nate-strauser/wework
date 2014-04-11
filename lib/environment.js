daysUntilExpiration = function() {
    var daysToWait = 90;
    var daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate()-daysToWait);
    return daysAgo;
}