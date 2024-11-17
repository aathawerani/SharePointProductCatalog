
var notificationHTML = "" +
"<div id='divNotificationIcon' " +
"style='" +
"    position: fixed;" +
"    top: 0px;" +
"    right: 150px;" +
"    /*width: 180px;*/" +
"'>" +

"    <ul class='nav nav-tabs'>" +
"        <li role='presentation' class='dropdown'>" +
"            <a href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='true' style='background-color: lightgrey;'><i class='glyphicon glyphicon-bell'></i> Notifications <span id='spanNotificationCount' class='badge' style='display:none'>0</span> <span class='caret'></span> </a>" +
"            <ul id='ulNotificationPanel' class='dropdown-menu dropdown-menu-right' style='max-height: calc(75vh);overflow-y: scroll;'>" +
"               <li><a href='#'>No notification to show</a></li>"+
"            </ul>" +
"        </li>" +
"    </ul>" +

"</div>";

//document.body.append(notificationHTML);


function showUpdatedNotifications() {


    //(typeof($("#divNotificationIcon")) == 'undefine' || $("#divNotificationIcon").length == 0) ? 'true' : 'false'
    //if (typeof ($("#divNotificationIcon")) == 'undefine' || $("#divNotificationIcon").lenght == 0) {
        if ((typeof($("#divNotificationIcon")) == 'undefine' || $("#divNotificationIcon").length == 0)) {

            $("body").append(notificationHTML);
        }

    
    var _fid = GetUrlKeyValue('fid');

    if (Number(_fid) > 0) {
    }
    var notificationDateFilter = new Date(new Date().setDate(-30)).toISOString();
    var filterNomenclature = "Created gt datetime'" + notificationDateFilter + "' and HasSeen eq 0 and NotifyToUsersId eq " + _spPageContextInfo.userId + "&$top=100&$select=Id,Title,RecordId,ProductLookup/Id,ProductLookup/Title,ArtworkLookup/Id,ArtworkLookup/Title,CredentialLookup/Id,CredentialLookup/Title,LotReleaseLookup/Id,LotReleaseLookup/Title,Action,HasSeen,SeenOn,ModuleType,Created&$expand=ProductLookup,ArtworkLookup,CredentialLookup,LotReleaseLookup&$orderby=Id desc";
    GetSPListItems("Notifications", 0, filterNomenclature)
        .done(function (data) {

            var response = data.d.results;
            var notiCount = 0;

            $("#spanNotificationCount").hide();
            $('#ulNotificationPanel').html('');


            for (var i = 0; i < response.length ; i++) {

                var _item = response[i];
                var _url = "#";
                var toolTip = "";
                if (_item.ModuleType == Module.ProductManagement) {
                    _url = "ProductDashboard.aspx?pid=" + _item.ProductLookup.Id + "&notid=" + _item.Id;
                    toolTip = (_item.ProductLookup ? "Product: " + _item.ProductLookup.Title : "");
                }
                else if (_item.ModuleType == Module.Artwork) {
                    _url = "Artwork.aspx?aid=" + _item.ArtworkLookup.Id + "&notid=" + _item.Id;

                }
                else if (_item.ModuleType == Module.CompanyCredentials) {
                    _url = "Credential%20Management.aspx?cid=" + _item.CredentialLookup.Id + "&notid=" + _item.Id;

                }
                else if (_item.ModuleType == Module.LotRelease) {
                    _url = "Lot%20Release.aspx?rid=" + _item.LotReleaseLookup.Id + "&notid=" + _item.Id;

                }

                if (_item.Action == "Submit") {
                    _url = "AdminApproval.aspx?notid=" + _item.Id;
                }

                var li_Row = "<li id='" + _item.Id + "'><a href='" + _url + "' title='" + toolTip + "'>" + _item.Title + "</a></li>";

                $('#ulNotificationPanel').append(li_Row);

                notiCount++;

            }

         
            if (notiCount > 0) {
                $("#spanNotificationCount").text(notiCount);

                $("#spanNotificationCount").show();
            }



            var lisShowAll = "<hr class='no-margin' /><li id='liShowAll'><a href='Notifications.aspx' title='See all notifications' style='text-align: center;'>See all notifications</a></li>";

            $('#ulNotificationPanel').append(lisShowAll);

            setTimeout(function () {
                showUpdatedNotifications();
            }, 5000);
        }).fail(onerror);

}



$(document).ready(function () {
 
    var _notid = GetUrlKeyValue('notid');

    if (Number(_notid) > 0) {

       // markAsRead(_notid);
    }

});

function markAsRead(_notid) {

    
    var jsonData = {
        HasSeen: true,
        //SeenOn: 
    }

    UpdateSPList("Notifications", _notid, jsonData).done(function (data) {

    }).fail(onerror);
}