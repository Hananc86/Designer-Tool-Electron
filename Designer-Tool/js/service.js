module.exports = serviceObj = {

    read: function(path) {
        let data = fs.readFileSync(path);
        let results = JSON.parse(data);
        return results;
    },

    write: function(path, data) {
        let temp = JSON.stringify(data, null, 2);
        let userData = fs.writeFileSync(path, temp, 'utf8');

    },

    saveStyleSheet: function() {
        stylesheet = css.stringify(stylesheet);

        // write(`C:/Users/Hananc/Desktop/Designer-Tool/css/application/styleDefualt2.txt`,stylesheet)
        // console.log(stylesheet)
        fs.writeFileSync(`./css/application/styleDefualt.css`, stylesheet, 'utf8')
    },

    openStyleSheet: function() {
        stylesheet = css.parse(cssfile, {
            source: cssfile
        });
    },

    getArrOfEffectedCssPropertiesFromElement: function(el) {
        //working only with element wiht ID
        let sheets = document.styleSheets,
            ret = [];
        el.matches = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector ||
            el.msMatchesSelector || el.oMatchesSelector;
        for (let i in sheets) {
            let rules = sheets[i].rules || sheets[i].cssRules;
            for (let r in rules) {
                if (el.matches(rules[r].selectorText)) {
                    ret.push(rules[r].cssText);
                }
            }
        }
        return ret;
    },


    regularSelectors: function() {
        this.openStyleSheet();
        let groups = [];
        for (let i = 0; i < stylesheet.stylesheet.rules.length; i++) {
            groups.push(stylesheet.stylesheet.rules[i]);
        }


        let ArraysOfSelectors = [];
        for (key in groups) {
            if (groups[key].selectors) {
                ArraysOfSelectors.push(groups[key].selectors)
            }
        }

        let allclass = [],
            hovers = [],
            selected = [];
        ArraysOfSelectors.map(function(item) {

            item.map(function(innerItem) {
                allclass.push(innerItem.trim().replace(/\s+/g, ' '))
            })
        })


        // console.log(allclass.length);
        for (let i = 0; i < allclass.length; i++) {

            if (allclass[i].includes(':hover')) {
                hovers.push(allclass[i]);
                allclass.splice(allclass.indexOf(allclass[i]), 1)


            } else if (allclass[i].includes('selected')) {
                selected.push(allclass[i]);
                allclass.splice(allclass.indexOf(allclass[i]), 1)


            } else if (allclass[i].includes('body')) {
                allclass.splice(allclass.indexOf(allclass[i]), 1)

            }

        }

        return allclass;

    },

    getHover: function(group) {
        let hoversArr = [];
        for (key in group) {

            let temp = group['selectors'];
            // console.log(temp)
            temp.map((item) => {

                if (item.includes(':hover')) {
                    hoversArr.push(item)
                }
            })
        }
        return hoversArr
    },


    getRegularSelected: function(group) {
        let regularSelected = [];
        for (key in group) {

            let temp = group['selectors'];
            // console.log(temp)
            temp.map((item) => {

                if (!item.includes(':hover')) {
                    regularSelected.push(item)
                }
            })
        }

        return this.removeDuplicatesFromArray(regularSelected)
    },


    removeDuplicatesFromArray: (arr) => {

        let temp = arr.filter(function(item, pos) {
            return arr.indexOf(item) == pos;
        })
        return temp;
    },


    checkInstancesOfClass: (Class) => {

        let result = [];
        let theClass, index, properties;
        let styleSheet = stylesheet.stylesheet.rules;
        styleSheet.map((key) => {
                let keySelectors = key.selectors;
                let a = keySelectors
                for (key2 in a) {
                   
                    if (a[key2] === Class) {
                  
                        theClass = a[key2];
                        // console.log(`${a[key2]},${arr.indexOf(key)},${serviceObj.getPropertiesFromSingleClass(arr.indexOf(key))}`)
                        theClass = a[key2];
                        index = styleSheet.indexOf(key)
                        properties = serviceObj.getPropertiesFromSingleClass(styleSheet.indexOf(key))
                        result.push(styleSheet.indexOf(key))
                    }
                }

            }

        )
        return result;
    },



    getAllPropertiesFromClass: (arrayOfIndexes) => {

        let properties = [];
        // console.log(stylesheet.stylesheet.rules)
        for (let i = 0; i < arrayOfIndexes.length; i++) {
            let declarations = stylesheet.stylesheet.rules[arrayOfIndexes[i]].declarations
            declarations.map((key) => {

                properties.push(key.property);

            })

        }
        // console.log({properties,arrayOfIndexes});
        return {
            properties,
            arrayOfIndexes
        }
    },


    getPropertiesFromSingleClass: (index) => {

        let properties = [];
        // console.log(stylesheet.stylesheet.rules)
        // console.log(index);
        let declarations = stylesheet.stylesheet.rules[index].declarations
        declarations.map((key) => {
            properties.push(key.property + '');
        })


        // console.log(properties);
        return properties
    },

    //adding new properties to StyleSheet file and print if duplicates was founded. 
    searchAndChangeStyle: (selector, newPropsObj) => {
        let result = [];
        let styleSheet = stylesheet.stylesheet.rules;
        let indexArr = serviceObj.checkInstancesOfClass(selector);

        //  console.log(serviceObj.checksDuplicatesPropsFromClass(selector))
        propertiesOfTheClass = serviceObj.getAllPropertiesFromClass(indexArr).properties;
        locationInStylesheetObj = serviceObj.getAllPropertiesFromClass(indexArr).arrayOfIndexes;
        locationInStyleSheetFile = [];
        //checks if the object is not empty
        Object.keys(newPropsObj).length === 0 && newPropsObj.constructor === Object

        
        // console.log(indexArr);

        //checks if there any duplicates props for class.. if there is duplicate prop it will handle the last1
        // console.log(propertiesOfTheClass)
        duplicates = serviceObj.checkDuplicatesFromArray(propertiesOfTheClass)
        // console.log(duplicates);

        //push the locations obj to duplicatesobj after converting to stylesheet location. 
        locationInStylesheetObj.map((index) => {
            locationInStyleSheetFile.push(styleSheet[index].position.start.line)
        });



        duplicatesObj = {
            duplicates: {
                props: duplicates,
                styleSheetLocations: ""
            },
            properties: propertiesOfTheClass,
            locationInObj: locationInStylesheetObj,
            locationInStyleSheetFile: locationInStyleSheetFile,
        }


        //print only if its found duplicates
        console.log(duplicatesObj.duplicates.props !== false ? duplicatesObj : "");


        
if(duplicatesObj.duplicates.props === false){

        //indexArr = instances of the selector in StyleSheet Obj
        indexArr.map((index) => {
            //declarations = properties from StyleSheet Obj
            let declarations = styleSheet[index].declarations;

            declarations.map((prop) => {

                for (item in newPropsObj) {

                    if (prop.property === item && newPropsObj[item] !== "") {
                        // console.log(prop.property)
                        prop.value = newPropsObj[item]
                        result.push(prop.property)
                        console.log(`File Was Changed - StyleSheet Line: ${prop.position.start.line}, ${item}:${newPropsObj[item]}`)


                    }

                }

            })

        })


        
        styleSheet = css.stringify(stylesheet);
        
        let path = __dirname.split('')
        path.splice(-3,3)
        path=path.join('')
       
        fs.writeFileSync(`${path}/css/application/styleDefualt.css`, styleSheet)
        // console.log(styleSheet)
        
        return result;




}else{
    
    
    console.log('duplicates conflict')




}

    },

    checksDuplicatesPropsFromClass: (Class) => {
        let styleSheet = stylesheet.stylesheet.rules;
        let indexArr = serviceObj.checkInstancesOfClass(Class).sort();
        let declarations = [];
        let result = [];
        indexArr.map((index) => {
            declarations.push(styleSheet[index].declarations);
            // console.log(declarations);

        })


        declarations.map((propObj) => {
            for (prop in propObj) {
                result.push(propObj[prop].property)
            }
        })


        if (serviceObj.checkDuplicatesFromArray(result) !== false) {
            propsDuplicates = result
            let lastlInstanceOfDuplicateProp;

            indexArr.map((index) => {
                console.log(styleSheet[index].declarations)
                let props = styleSheet[index].declarations;
                for (prop in props) {
                    if (props[prop].property === propsDuplicates[0]) {

                        console.log(styleSheet[index].position.start.line);



                    }
                }

            })

        }
    },

    checkDuplicatesFromArray: (arr) => {

        var sorted_arr = arr.slice().sort();
        var results = [];
        for (var i = 0; i < arr.length - 1; i++) {
            if (sorted_arr[i + 1] == sorted_arr[i]) {
                results.push(sorted_arr[i]);
            }
        }
        //   console.log(results);
        if (results.length > 0) {
            console.log(`Duplicates Props:  ${results} `);
            return results;
        } else {
            return false
        }
    },

}