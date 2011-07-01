var tilelive = require('tilelive');
var url = require('url');

models.Tileset.syncread = function(data, options) {
    data.host = _(options.tileHost).map(function(host) {
        return url.format({
            host: host,
            pathname: options.basepath,
            protocol: 'http:'
        });
    });
    data.tiles = _(options.tileHost).map(function(host) {
        return url.format({
            host: host,
            pathname: options.basepath + '1.0.0/' + data.id + '/${z}/${x}/${y}.png',
            protocol: 'http:'
        });
    });
    if (data.formatter) data.grids = _(options.tileHost).map(function(host) {
        return url.format({
            host: host,
            pathname: options.basepath + '1.0.0/' + data.id + '/${z}/${x}/${y}.grid.json',
            protocol: 'http:'
        });
    });
    data.download = url.format({
        host: options.tileHost[0],
        pathname: options.basepath + 'download/' + data.basename,
        protocol: 'http:'
    });
    return data;
};

// Server-side sync method for Tileset model.
models.Tileset.prototype.sync = function(method, model, success, error) {
    switch (method) {
    case 'read':
        var uri = model.options.uri;
        if (!uri) uri = Bones.plugin.config.tiles + model.options.basepath + '?id=' + model.get('id');

        tilelive.info(uri, function(err, data, source) {
            if (err) return error(err);
            data = models.Tileset.syncread(data, model.options);
            model.source = source;
            success(data);
        });
        break;
    }
};
