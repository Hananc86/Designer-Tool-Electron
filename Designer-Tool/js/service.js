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
        console.log(stylesheet)
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
                    // console.log(a[key2])
                    if (a[key2] === Class) {
                        // console.log(a[key2])
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

        // console.log( {
        //     "class":theClass,
        //     index,
        //     properties
        // });
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
        // console.log(properties);
        return properties
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

    searchAndChangeStyle: (selectorArr, newPropsObj) => {
        //checks if the object is not empty
        Object.keys(newPropsObj).length === 0 && newPropsObj.constructor === Object







        let indexArr = serviceObj.checkInstancesOfClass(selectorArr[0]);
        // console.log(indexArr);

        //checks if there any duplicates props for class.. if there is duplicate prop it will handle the last1
         duplicates = serviceObj.checkDuplicatesFromArray(serviceObj.getAllPropertiesFromClass(indexArr))
         console.log(duplicates,indexArr.sort())

        let styleSheet = stylesheet.stylesheet.rules;


        indexArr.map((index) => {
            let declarations = styleSheet[index].declarations;
            declarations.map((prop) => {

                for (keyNewObj in newPropsObj) {
                    if (prop.property === keyNewObj) {
                        // console.log(prop.property)
                        prop.value = newPropsObj[keyNewObj]
                        console.log(prop)

                    }
                }
            })
        })
    },

    checksDuplicatesPropsForEachClass:(Class)=>{
        let styleSheet = stylesheet.stylesheet.rules;
        let indexArr = serviceObj.checkInstancesOfClass(Class);
        let declarations=[]; 
        indexArr.map((index)=>{
            declarations = styleSheet[index].declarations;
            console.log(declarations);


        })
        






    },

    checkDuplicatesFromArray:(arr)=>{

      var sorted_arr = arr.slice().sort(); 

      var results = [];
      for (var i = 0; i < arr.length - 1; i++) {
          if (sorted_arr[i + 1] == sorted_arr[i]) {
              results.push(sorted_arr[i]);
          }
      }
      
      if(results){
        console.log(`duplicates was found: ${results}`);
        return results;
      }
      
      
    }


}




// indexArr.map((index)=>{
//     let declarations = styleSheet[index].declarations;
//     declarations.map((prop)=>{




//         if(prop.property === property){
//             console.log(prop.property)
//             prop.value = value
//             console.log(prop)

//             return ''
//         }


//     })




// })




// styleSheet.map((rule)=>{

//     if(rule.selectors !== undefined){
// let selectors = rule.selectors;
//     console.log(rule.selectors)
//     selectors.map((prop)=>{




//     })



//     }



// })