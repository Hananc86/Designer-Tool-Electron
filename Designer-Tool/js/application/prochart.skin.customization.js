window.prochartSkinsCustomization = {
    /**
     * Override Prochart object default settings (before objChat.gui.loadLayout() call).
     * @param objChat
     */
    beforeLoadLayout: function (objChat) {
        //objChat.chart.PriceChartType = "line";			// no color fill under the graph stroke		
    },

    /**
     * Override Prochart object default settings (before objChat.gui.createChart() call).
     * @param objChat
     */
    beforeCreateChart: function (objChat) {
        //objChat.chart.PriceChartType = "line";
		//objChat.chart.LineLastCloseMarkRadius = <value>	// Realtime dot radius
		objChat.chart.DateSpaceFactor = 2.5; 				//Smaller number less space / Bigger number more space between time numbers.		
    },
    /**
     * Override Prochart theme default settings;
     * @param themes
     */
    applySkinToProchartThemes: function (themes) {

        // set template customization for the selected layout

        themes["core_prochart_theme_main_chart"].prochartThemeCustomisation = {

            path: '200/layout1_200/',	//path is pointer to “Skins/graphs/smallAdvinionChart/”
            stomLayoutFile: 'layout1.js',
            jsonCssFile: 'template_200.json.js',
            templateCssFile: 'template_200.css',
            template: 'template_200'

        };

        // Target lines color - main price line
	    themes["core_prochart_theme_main_chart"].level.targetPrice.strLineColor ='rgba(0, 0, 0, 1)';

		// Option highlight colors - User selection area
		themes["core_prochart_theme_main_chart"].highlight.directionUp.color ='rgba(196, 196, 196, 1)';
		themes["core_prochart_theme_main_chart"].highlight.directionDown.color ='rgba(196, 196, 196, 1)';
		themes["core_prochart_theme_main_chart"].highlight.directionIn.color ='rgba(196, 196, 196, 1)';
		themes["core_prochart_theme_main_chart"].highlight.directionOut.color ='rgba(196, 196, 196, 1)';
		themes["core_prochart_theme_main_chart"].highlight.positionAtTheMoney.color ='rgba(196, 196, 196, 1)';		// same as target price
		
		// Position highlight colors
		themes["core_prochart_theme_main_chart"].highlight.positionInTheMoney.color ='rgba(70, 128, 123, 0.6)';		// area of success
		themes["core_prochart_theme_main_chart"].highlight.positionOutOfTheMoney.color ='rgba(235, 92, 92, 0.6)';	// area of lose

		//Expiry time line
		themes["core_prochart_theme_main_chart"].timeMark.noMoreTrade.strLineColor ='rgba(185, 185, 185, 1)';
		
		//The color of the buying price dot
		themes["core_prochart_theme_main_chart"].circle.strColor = 'rgba(255, 0, 0, 1)';		

    }
};


