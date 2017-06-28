const fs = require("fs");
const cmd = require('node-cmd');
// const awk = require('awk');
// const grepit = require('grepit');
const helper = require('./js/helper.js');

const {
    dialog
} = require('electron').remote;
const path = require('path');
const rgbHex = require('rgb-hex');
const userPath = path.resolve();
const fullPath = userPath;
let relativePath = userPath;
relativePath = relativePath.split('\\');
relativePath.splice(-1, 1);
relativePath = relativePath.join('\\');

//for production only
aplicationGroups = read(`${__dirname}/data/groups.json`);
let forex = fs.readFileSync(`${__dirname}/data/forex.txt`).toString();
let binary = fs.readFileSync(`${__dirname}/data/binary.txt`).toString();
let globalHelp = fs.readFileSync(`${__dirname}/data/globalHelp.txt`).toString();


// aplicationGroups = read('data/groups.json');
// let forex = fs.readFileSync('data/forex.txt').toString();
// let binary = fs.readFileSync('data/binary.txt').toString();
// let globalHelp = fs.readFileSync('data/globalHelp.txt').toString();


$('.body_container').replaceWith(binary);


let properties = {
    background: `<div><label>Background:</label><input type="text" id="background-input"></div>`,
    color: `<div><label>Color:</label><input type="text" id="color-input"></div>`,
    border: `<div><label>Border:</label><input type="text" id="border-input"></div>`,
    boxShadow: `<div><label>Box-Shadow:</label><input type="text" id="box-shadow-input"></div>`,
    "border-radius": `<div><label>Border-Radius:</label><input type="text" id="border-radius-input"></div>`,
    "text-decoration": `<div><label>Text-Decoration:</label><input type="text" id="text-decoration"></div>`,
    "font-weight": `<div><label>Font-Weight:</label><input type="text" id="font-weight"></div>`
}




$('#inputs').html('<h1 class="begining-title">Please Choose Group To Begin...</h1>');

function init() {

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

}


init();

//reading the json file and retrives all the data, colors and etc to DOM.
function fetchPropsFromJsonToDom(group) {

    let propertiesHover = aplicationGroups[group]['hover']['propertiesFinal_hover'];
    // let selectorsHover = aplicationGroups[group]['hover']['selectors'].join(',').replace(' ', ',');
    let selectorsHover = aplicationGroups[group]['hover']['selectors'].join(',');
    let selectorsArrRegular = aplicationGroups[group]['regular']['selectors'];

    for (i = 0; i < selectorsArrRegular.length; i++) {

        if (selectorsArrRegular[i] === '.header_container') {
            $('#application').css(aplicationGroups[group]['regular']['propertiesFinal_regular']);

        } else {

            $(selectorsArrRegular[i]).css(aplicationGroups[group]['regular']['propertiesFinal_regular']);

        }

    }

    if (selectorsHover !== "") {
        createCSSSelector(selectorsHover, objToString(propertiesHover));
    }

}

function resetWork() {
    for (group in aplicationGroups) {
        resetAll(group)
    }
}

function resetAll(group) {
    let defualtPropsForHoverState = aplicationGroups[group]['hover']['defualtPropertiesHover']
    let emptyProperties = {
        background: "",
        border: "",
        color: "",
        "box-shadow": "",
        "border-radius": "",
        "text-decoration": "",
        "font-weight": ""
    }

    let selectorsArrRegular = aplicationGroups[group]['regular']['selectors'];


    for (i = 0; i < selectorsArrRegular.length; i++) {

        if (selectorsArrRegular[i] === '.header_container') {
            $('#application').css(emptyProperties);
        } else {
            $(selectorsArrRegular[i]).css(emptyProperties);
        }

    }




    //removing styles from hovers and selected (it works only if this function execute 3 times.)
    deleteAllHoversAndSelectedStyles();
    deleteAllHoversAndSelectedStyles();
    deleteAllHoversAndSelectedStyles();


    $('#normalModal,.modal-backdrop').css('display', "none");
    resetInputs();

    aplicationGroups[group]['regular']['propertiesFinal_regular'] = emptyProperties;
    aplicationGroups[group]['hover']['propertiesFinal_hover'] = emptyProperties
    aplicationGroups[group]['selected']['propertiesFinal_hover'] = emptyProperties
    write('data/groups.json', aplicationGroups);

}



function engine(e) {
    var elementsArr = $("*.border-selected");
    for (i = 0; i < elementsArr.length; i++) {
        $(elementsArr[i]).removeClass('border-selected');
    }
    elementsArr.map(element => $(element).removeClass('border-selected'))

    let group = this.getAttribute('data-group');
    let elementsForAddingBorder = aplicationGroups[group]['previewBorders'];

    for (i = 0; i < elementsForAddingBorder.length; i++) {
        $(elementsForAddingBorder[i]).addClass('border-selected');
    }

    $('#inputs').html(inputsCreator(group)).hide().fadeIn(1000)

        .animate({
            width: '95%',
            opacity: '1'
        }, 'slow')
        .animate({
            fontSize: "18px"
        }, 1000);

    $('#saveButton').bind('click', () => processingPropertiesToTheDom(group));
    $('#resetButton').bind('click', () => restoreToDefualtGroup(group));
    $('#groupProperties').bind('click', () => currentGroupProperties(group));
    $('#generateCssFile').bind('click', () => generateCssFile(group));
    $('#resetAll').bind('click', () => resetWork());


}


function inputsCreator(group) {

    let props = aplicationGroups[group]['properties']
    let state = aplicationGroups[group]['state']

    return `
               <h1 class="group-title">Group: ${group}</h1>
               <div class="propeties-inputs">
                   ${aplicationGroups[group]['state']
                   ?
                   `
                   <label>State:</label>
                   <select>
                     <option>Regular</option>
                     <option>Hover</option>
                     <option>Selected</option>
                    </select>`
                    :

                    ''
                }

                ${props.map( prop => properties[prop]).join(' ')}
            <div class="buttons">
                  <button class="btn btn-primary"  id="resetButton">Reset</button>    
                  <button class="btn btn-primary" id="saveButton">Save</button> 
                  <button class="btn btn-primary" id="groupProperties">Current Group Properties</button>
                   <a data-toggle="modal" href="#normalModal" class="btn btn-danger reset-all-groups" >Reset All Groups</a> 
 
            </div>
               </div> 
               <h3><strong>Details</strong></h3>
               <p>
                ${aplicationGroups[group]['discription']}<br/>
               </p>
               <br/>
               <br/>
           `

}

function read(path) {
    var data = fs.readFileSync(path);
    var results = JSON.parse(data);
    return results;
}

function write(path, data) {
    var temp = JSON.stringify(data, null, 2);
    var userData = fs.writeFileSync(path, temp, 'utf8');
}

//Responsible for the Save Button. 
function processingPropertiesToTheDom(group) {

    let state = $('#inputs > div > select').val()
    let backgroundInput = $('#background-input').val()
    let borderRadiusInput = $('#border-radius-input').val();
    let boxShadowInput = $('#box-shadow-input').val();
    let borderInput = $('#border-input').val();
    let colorInput = $('#color-input').val();
    let textDecoration = $('#text-decoration').val();
    let fontWeight = $('#font-weight').val();
    resetInputs();

    let properties = {
        background: backgroundInput,
        border: borderInput,
        color: colorInput,
        "box-shadow": boxShadowInput,
        "border-radius": borderRadiusInput,
        "text-decoration": textDecoration,
        "font-weight": fontWeight
    }

    for(prop in properties){
        if(properties[prop] === undefined || properties[prop] === ""){
        delete properties[prop];
        }
    }


    if (state === "Regular") {
        aplicationGroups[group]['regular']['propertiesFinal_regular'] = properties;
        write('data/groups.json', aplicationGroups);
        fetchPropsFromJsonToDom(group);

    } else if (state === "Hover") {
        aplicationGroups[group]['hover']['propertiesFinal_hover'] = properties;
        write('data/groups.json', aplicationGroups);
        fetchPropsFromJsonToDom(group);
    } else {

        aplicationGroups[group]['regular']['propertiesFinal_regular'] = properties;
        write('data/groups.json', aplicationGroups);
        fetchPropsFromJsonToDom(group);

    }


}

function restoreToDefualtGroup(group) {
    
    let properties = {
        background: "",
        border: "",
        color: "",
        "box-shadow": "",
        "border-radius": "",
        "text-decoration": "",
        "font-weight": ""
    }

    let state = $('#inputs > div > select').val()


    if (state === "Hover" || state === "Selected") {
        deleteHoversAndSelectedByGroup(group, state);
        aplicationGroups[group]['propertiesFinal_hover'] = properties;
        aplicationGroups[group]['propertiesFinal_selected'] = properties;
        write('data/groups.json', aplicationGroups);
        

    } else {

        
        aplicationGroups[group]['propertiesFinal_regular'] = properties;
      
        
        let selectorsArr = aplicationGroups[group]['regular']['selectors'].join(',');

        if (group === "A") {
            $('#application').css(properties);
        }

        $(selectorsArr).css(properties);
       
        resetInputs();
       
      
        processingPropertiesToTheDom(group)
       



    }



}

// function change_link_rel(newLinkPath, oldLink) {
//     let old1 = document.getElementsByTagName('link').item(oldLink);
//     let new1 = document.createElement('link');

//     new1.setAttribute("rel", "stylesheet");
//     new1.setAttribute("type", "text/css");
//     new1.setAttribute("href", newLinkPath);

//     document.getElementsByTagName('head').item(0).replaceChild(new1, old1);

// }




function currentGroupProperties(group) {

    let selector = aplicationGroups[group]['regular']['selectors'][0];
    let propertiesArr = aplicationGroups[group]['properties'];


    let background = rgbToHex($(selector).css('background-color'));
    let color = rgbToHex($(selector).css('color'));
    let fontWeight = $(selector).css('font-weight');
    let textDecoraton = $(selector).css('text-decoration');

    let borderStyle = $(selector).css('border-style') == "" ? "" : $(selector).css('border-style').split(' ')[0];
    let borderWidth = $(selector).css('border-width') == "" ? "" : $(selector).css('border-width').split(' ')[0];
    var borderColor = $(selector).css('border-color');
    borderColor = rgbToHex(borderColor.split('').splice(0, borderColor.indexOf(')') + 1).join(''));



    let properties = {
        background,
        color,
        border: `${borderWidth} ${borderStyle} ${borderColor}`,
        "box-shadow": "",
        "border-radius": "",
        "font-weight": fontWeight,
        "text-decoration": textDecoraton
    }



    $('#background-input').val(properties.background)
    $('#border-radius-input').val(properties["border-radius"]);
    $('#box-shadow-input').val(properties['box-shadow']);
    $('#border-input').val(properties['border']);
    $('#color-input').val(properties['color']);
    $('#font-weight').val(properties["font-weight"]);
    $('#text-decoration').val(properties["text-decoration"]);


}


function rgbToHex(color) {

    if (color.startsWith('rgb')) {

        return '#' + rgbHex(color);
    } else {

        return color;

    }

}


function resetInputs() {

    $('#background-input').val('')
    $('#border-radius-input').val('');
    $('#box-shadow-input').val('');
    $('#border-input').val('');
    $('#color-input').val('');
    $('#text-decoration').val('');
    $('#font-weight').val('');
}

function generateCssFile() {

    let content = "Some text to save into the file";
    dialog.showSaveDialog((fileName) => {
        if (fileName === undefined) {
            console.log("You didn't save the file");
            return;
        }

        // fileName is a string that contains the path and filename created in the save file dialog.  
        fs.writeFile(fileName, content, (err) => {
            if (err) {
                alert("An error ocurred creating the file " + err.message)
            }

            alert("The file has been succesfully saved");
        });
    });

}
var stopPropagation = `
   .header_container,
   .assets_list_header div,
   .options_list_header div,
   .navigation_menu_logged_out_panel div,
   .navigation_menu_live_chat_button,
   .navigation_menu_login_button,
   .navigation_menu_open_account_button,
   .actions_menu_link actions_menu_forgot_password_link,
   .navigation_menu_forgot_password_panel,
   .my_portfolio_positions_header div,
   .actions_menu_forgot_password_link,
   .option_mode_info_asset_label, .trade_mode_info_asset_label, .position_mode_info_asset_label, .asset_mode_info_asset_label,
   .option_mode_info_panel > div, .trade_mode_info_panel > div, .position_mode_info_panel > div, .asset_mode_info_panel > div,
   .clock_block > div,
   .open_account_links_link,.balance_deposit_button,
   .positions_sentiment_bar_percentage,
   .positions_sentiment_bar,
   .asset_direction_button_value,
   .asset_direction_button_value
   `

//fix layout issues (stopPropagation) 
$(`
   .assets_list_header div,
   .options_list_header div,
   .my_portfolio_positions_header div,
   .forex_portfolio_positions_header div
   `).css({

    "width": "inherit",
    "margin-right": "18%",
    "margin-top": "11px;",
    "line-height": "13px",
    "height": "13px",
    "margin-top": "13px"
}).click(e => event.stopPropagation());

$(stopPropagation).click(e => event.stopPropagation());



function replaceInstrument(instrument) {

    if (instrument == 'forex') {
        init();
        $(stopPropagation).click(e => event.stopPropagation());

        $(`
            .assets_list_header div,
            .options_list_header div,
            .my_portfolio_positions_header div,
            .forex_portfolio_positions_header div
            `).css({

            "width": "inherit",
            "margin-right": "18%",
            "margin-top": "11px;",
            "line-height": "13px",
            "height": "13px",
            "margin-top": "13px"
        }).click(e => event.stopPropagation());


    }



    if (instrument === 'binary') {
        init();
        $(stopPropagation).click(e => event.stopPropagation());

        $(`
             .assets_list_header div,
             .options_list_header div,
             .my_portfolio_positions_header div,
             .forex_portfolio_positions_header div
             `).css({

            "width": "inherit",
            "margin-right": "18%",
            "margin-top": "11px;",
            "line-height": "13px",
            "height": "13px",
            "margin-top": "13px"
        }).click(e => event.stopPropagation());

    }

}




//pagination
let cuurentPage = 1;
$('.right').bind('click', function() {

    if (cuurentPage < 2) {
        cuurentPage++
    }
    

    if (cuurentPage == 2) {
        $('.body_container').fadeOut(1600, () => {
            $('.body_container').replaceWith(forex);
            replaceInstrument('forex')
        });
    }


})

$('.left').bind('click', function() {

    if (cuurentPage > 1) {
        cuurentPage--
    }
    


    if (cuurentPage === 1) {
        $('.body_container').fadeOut(1600, () => {
            $('.body_container').replaceWith(binary);
            replaceInstrument('binary')

        })

    }



})




// $('.right').bind('click',function(){
// $('.body_container').toggle('slow',replaceToForex);
// });




function createCSSSelector(selector, style) {
    if (!document.styleSheets) return;
    if (document.getElementsByTagName('head').length == 0) return;

    var styleSheet, mediaType;

    if (document.styleSheets.length > 0) {
        for (var i = 0, l = document.styleSheets.length; i < l; i++) {
            if (document.styleSheets[i].disabled)
                continue;
            var media = document.styleSheets[i].media;
            mediaType = typeof media;

            if (mediaType === 'string') {
                if (media === '' || (media.indexOf('screen') !== -1)) {
                    styleSheet = document.styleSheets[i];
                }
            } else if (mediaType == 'object') {
                if (media.mediaText === '' || (media.mediaText.indexOf('screen') !== -1)) {
                    styleSheet = document.styleSheets[i];
                }
            }

            if (typeof styleSheet !== 'undefined')
                break;
        }
    }

    if (typeof styleSheet === 'undefined') {
        var styleSheetElement = document.createElement('style');
        styleSheetElement.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(styleSheetElement);

        for (i = 0; i < document.styleSheets.length; i++) {
            if (document.styleSheets[i].disabled) {
                continue;
            }
            styleSheet = document.styleSheets[i];
        }

        mediaType = typeof styleSheet.media;
    }

    if (mediaType === 'string') {
        for (var i = 0, l = styleSheet.rules.length; i < l; i++) {
            if (styleSheet.rules[i].selectorText && styleSheet.rules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
                styleSheet.rules[i].style.cssText = style;
                return;
            }
        }
        styleSheet.addRule(selector, style);
    } else if (mediaType === 'object') {
        var styleSheetLength = (styleSheet.cssRules) ? styleSheet.cssRules.length : 0;
        for (var i = 0; i < styleSheetLength; i++) {
            if (styleSheet.cssRules[i].selectorText && styleSheet.cssRules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
                styleSheet.cssRules[i].style.cssText = style;
                return;
            }
        }
        styleSheet.insertRule(selector + '{' + style + '}', styleSheetLength);
    }
}

function objToString(obj) {
    var result = ''
    for (i = 0, j = 0; i < Object.keys(obj).length && j < Object.values(obj).length; i++, j++) {

        if (Object.keys(obj)[i] !== "" && Object.values(obj)[j] !== "") {
            result += Object.keys(obj)[i] + ':' + Object.values(obj)[j] + ' !important; '
        }
    }
    return result;
}

function deleteAllHoversAndSelectedStyles() {
    var cssRules = document.styleSheets[0].cssRules;


    for (i = 0; i < cssRules.length; i++) {
        document.styleSheets[0].deleteRule('*')
    }
}

function deleteHoversAndSelectedByGroup(group, state) {

    let result;


    if (state === "Hover") {


        if (group === "H" || group === "G") {

            for (i = 0; i < document.styleSheets[0].rules.length; i++) {
                result = document.styleSheets[0].rules[i].cssText;
                if (result.search(".option_row_container:hover") != -1) {
                    
                    document.styleSheets[0].deleteRule(i);

                }
            }

        } else {


            for (i = 0; i < document.styleSheets[0].rules.length; i++) {
                result = document.styleSheets[0].rules[i].cssText;
                if (result.search(aplicationGroups[group]['hover']['selectors'][0]) != -1) {

                  
                    document.styleSheets[0].deleteRule(i);

                }
            }


        }

    } else if (state === "Selected") {


        for (i = 0; i < document.styleSheets[0].rules.length; i++) {
            result = document.styleSheets[0].rules[i].cssText;
            if (result.search(aplicationGroups[group]['selected']['selectors'][0]) != -1) {

                document.styleSheets[0].deleteRule(i);

            }
        }

    }

}