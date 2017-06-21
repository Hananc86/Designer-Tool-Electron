module.exports = {
    init:function() {

        for (group in aplicationGroups) {
            fetchPropsFromJsonToDom(group);
            addingGroupPropsToDom(group);
            
        }
    
        function addingGroupPropsToDom(group) {
            let selectorsArrRegular = aplicationGroups[group]['regular']['selectors'];
    
            for (i = 0; i < selectorsArrRegular.length; i++) {
                $(selectorsArrRegular[i]).attr("data-group", group);
            }
        }
    
        const elementsArr = $("*[data-group]");
        for (i = 0; i < elementsArr.length; i++) {
            $(elementsArr[i]).bind('click', engine);
            $(elementsArr[i]).css("cursor", "pointer");
    
        }

},
read:function(path) {
    var data = fs.readFileSync(path);
    var results = JSON.parse(data);
    return results;
},

write:function(path, data) {
    var temp = JSON.stringify(data, null, 2);
    var userData = fs.writeFileSync(path, temp, 'utf8');
}
    

}