
module.exports = {

    read = function (path) {
                var data = fs.readFileSync(path);
                var results = JSON.parse(data);
                return results;
    },

    write = function(path, data){
                var temp = JSON.stringify(data, null, 2);
                var userData = fs.writeFileSync(path, temp, 'utf8');

    }
}