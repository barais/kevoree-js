module.exports = {
    callable: function (obj) {
        return (obj != null && obj != undefined && typeof(obj) == 'function');
    }
};