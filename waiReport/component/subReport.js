﻿!function(){var e={declare:{type:"subReport",default:{}},properties:{reportName:{type:"path",visible:!0,readonly:!1,defaultValue:""},dataField:{type:"string",visible:!0,readonly:!1,defaultValue:""}},initialize:function(){},execDraw:function(e){var t=void 0!==this.reportName?this.reportName:"";t=this.name+' : "'+t+'"',e.save(),e.textAlign="left",e.textBaseline="top",e.font="40px Arial",e.fillStyle="#000000",e.fillText(t,this.left,this.top),e.restore()}};$waiReport.core.addComponentBase(e)}();