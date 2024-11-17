// Common Variables
var currentUserCustomInfo = null;
var currentUserProfilesInfo = [];
var currentUserProfilesDetailsInfo = [];

// Execute Common Functions
$(document).ready(function () {

    $("#s4-ribbonrow").hide();
    $("#O365_Settings_navbardatalinks").hide();
    

    getCurrentUserCustomInfo();
    if (typeof (isPageAccessable) != 'undefined') {
        isPageAccessable();
    } else {
        isPageAccessableCommon();
    }
    showSiteMenu();
});


function InsertIntoSPList(listName, dataItem, _async) {

    //-------------
    //alert(location_lookup);

    var itemType = GetItemTypeForListName(listName);

    if (typeof (_async) == 'undefined')
    {
        _async = true;
    }

    dataItem.__metadata = {
        "type": itemType
    };

    return $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + listName + "')/items",
        type: "POST",
        contentType: "application/json;odata=verbose",
        data: JSON.stringify(dataItem),
        async: _async,
        headers: {
            "Accept": "application/json; odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        },
        success: function (data) {

            console.log("InsertIntoSPList() Success", data);
        },
        error: function (data) {
            console.log("InsertIntoSPList() Error", data);
        }
    });

}

function UpdateSPList(listName,itemID, dataItem, _async) {

    //-------------
    //alert(location_lookup);

    var itemType = GetItemTypeForListName(listName);

    if (typeof (_async) == 'undefined') {
        _async = true;
    }
    else (_async !== true)
    {
        _async = false;
    }

    dataItem.__metadata = {
        "type": itemType
    };

  return  $.ajax({
        async: _async,
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('" + listName + "')/items(" + itemID + ")",
        type: "POST",
        data: JSON.stringify(dataItem),
        headers: {
            "Accept": "application/json;odata=verbose",
            "content-type": "application/json; odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "X-HTTP-Method": "MERGE",
            "If-Match": "*"
        },
    success: function (data) {

        console.log("UpdateSPList() Success", data);
    },
    error: function (data) {
        console.log("UpdateSPList() Error", data);
    }

    });

}

//Delete an list Item
function deleteItem(listName, spItem) {

    url = "/_api/Web/Lists/GetByTitle('" + listName + "')/getItemById(" + spItem.ID + ")";

    return $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + url,
        type: "DELETE",
        headers: {
            "accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "If-Match": spItem.__metadata.etag
        },
        error: function (data) {
            console.log("Error on deleteItem()", data);
        }
    });
}


function GetSPListItems(listName, itemID, filter, _async) {

    //-------------
    //alert(location_lookup);

    var itemType = GetItemTypeForListName(listName);

    if (typeof (_async) == 'undefined' || _async == true) {
        _async = true;
    }
    else 
    {
        _async = false;
    }

   /* if(_async === true){
        _async = true;
    }else{
        _async = false;
    }*/
    
    //var apiURL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + ListName + "')/items?$filter=substringof('" + HouseAreaId + "',HouseAreaLookup)";
    var apiURL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + listName + "')/items";
    if (itemID != null && Number(itemID) > 0) {
        apiURL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + listName + "')/items('" + itemID + "')";
    }
    else if (filter != null && filter.length > 0) {
        apiURL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + listName + "')/items?$filter=" + filter;
    }

    return $.ajax({
        url: apiURL,
        type: "GET",
        async: _async,
        headers: {
            "Accept": "application/json; odata=verbose",
        },
        success: function (data) {
            console.log("GetSPListItems() Success", data.d.results);
        },
        error: function (error) {
            console.log("GetSPListItems() Error", error);
        }
    });

}





/*
function GetSPListItems(listName, itemID, filter, _async) {

    
    //var apiURL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + ListName + "')/items?$filter=substringof('" + HouseAreaId + "',HouseAreaLookup)";
    var apiURL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + listName + "')/items";
    if (itemID != null && Number(itemID) > 0) {
        apiURL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + listName + "')/items('" + itemID + "')";
    }
    else if (filter != null && filter.length > 0) {
        apiURL = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + listName + "')/items?$filter=" + filter;
    }
    var responseResult = null;
    //fetcherAsync()
    if (typeof (_async) == 'undefined') {
        //_async = true;
                
        responseResult =  fetcherNonAsync(apiURL);
    }
    else (_async !== true)
    {
        responseResult = await fetcherAsync(apiURL);
   
    }
    
}*/


/*
// FOR paste into a console of source SharePoint site:

const DEST_DOMAIN = 'http://[destinationsite].domain.net'

async function getDigest(){

    let url = '${DEST_DOMAIN}}/_api/contextinfo';

return fetch(url,{

    method:'post',

    credentials:'include',

    headers:{'Accept':'application/json;odata=nometadata'}

})

.then(res => {

return res.json();

})

.then(data => {

return data;

})

.catch(error => console.error(error));

}

const DIGEST_OBJ = await getDigest();

const DIGEST = DIGEST_OBJ.FormDigestValue;

console.log('DIGEST',DIGEST)
*/

function fetcher(url,custom_err_msg){

    return fetch(url,{
        // method:'GET',
        // credentials:'include',
        headers:{
            'Content-Type':'application/json;odata=nometadata',
            'Accept':'application/json;odata=nometadata',
            //'X-RequestDigest':DIGEST
        }
    }).then(resp => {
        if(!resp.ok){
        throw new Error(resp.statusText);
}
return resp.json();
}).then(data => {
    return data;
}).catch(err => {
    if(custom_err_msg){
    console.error('${custom_err_msg}',err);
return '${custom_err_msg}\n${err}';
} else {
    return err;
}
});
}





function StartBatchRequest(ListData, listName) {
    // Every batch will have a Batch ID/GUID
    var batchGuid = GenerateGUID();

    // Create the body of the request
    var batchContents = new Array();

    // Every changeset/action will have have a ChangeSet ID/GUID
    var changeSetGUID = GenerateGUID();

    // Iterate through each record
    for (var i = 0; i < ListData.length; i++) {

        ListData[i].__metadata = {
            // Format of the "type" is: SP.Data.<>ListItem
            type: GetItemTypeForListName(listName)
        };

        // create the request endpoint
        var endpoint = _spPageContextInfo.webAbsoluteUrl
            + '/_api/web/lists/getbytitle(\'' + listName + '\')'
            + '/items';

        // create the changeset
        batchContents.push('--changeset_' + changeSetGUID);
        batchContents.push('Content-Type: application/http');
        batchContents.push('Content-Transfer-Encoding: binary');
        batchContents.push('');
        batchContents.push('POST ' + endpoint + ' HTTP/1.1');
        batchContents.push('Content-Type: application/json;odata=verbose');
        batchContents.push('');
        batchContents.push(JSON.stringify(ListData[i]));
        batchContents.push('');
    }
    // END changeset to create data
    batchContents.push('--changeset_' + changeSetGUID + '--');

    // batch body
    var batchBody = batchContents.join('\r\n');

    batchContents = new Array();

    // create a batch for creating items
    batchContents.push('--batch_' + batchGuid);
    batchContents.push('Content-Type: multipart/mixed; boundary="changeset_' + changeSetGUID + '"');
    batchContents.push('Content-Length: ' + batchBody.length);
    batchContents.push('Content-Transfer-Encoding: binary');
    batchContents.push('');
    batchContents.push(batchBody);
    batchContents.push('');

    batchContents.push('--batch_' + batchGuid + '--');
    batchBody = batchContents.join('\r\n');

    // Request endpoint for the entire batch
    var endpoint = _spPageContextInfo.webAbsoluteUrl + '/_api/$batch';

    var batchRequestHeader = {
        'X-RequestDigest': jQuery("#__REQUESTDIGEST").val(),
        'Content-Type': 'multipart/mixed; boundary="batch_' + batchGuid + '"'
    };

    // create request
    return jQuery.ajax({
        url: endpoint,
        type: 'POST',
        headers: batchRequestHeader,
        data: batchBody,
        success: function (response) {
            console.log(response);
        },
        fail: function (error) {
            console.log(response);
        }
    });
}
// This function is used to generate GUIDs for Batch and Changeset
function GenerateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}



function GetItemTypeForListName(name) {
    var _ltType = "ListItem";
    if (name.toLowerCase() == 'ArtworkAttachments'||
        name.toLowerCase() == 'ProductAttachments' ||
        name.toLowerCase() == 'CompanyCredentialsAttachment') {
        _ltType = "Item"
    }

    return "SP.Data." + name.charAt(0).toUpperCase() + name.split(" ").join("").slice(1) + _ltType;
}


function GetQueryString(name) {
    var retureValue = "";
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < url.length; i++) {
        var urlparam = url[i].split('=');
        if (urlparam[0] == name) {
            retureValue = urlparam[1].replace("#", "");
            return retureValue;
        }
    }
    return retureValue;
}


//const filterCombiner = (d, filterArray) => {
//    for (let fn of filterArray) {
//    if (!fn(d)) {
//      return false;
//}
//}
//return true;
//}


function getCurrentUserCustomInfo() {
     
    var resetNeed = true;
    var storedTime = sessionStorage.getItem("lc_storedtime");
    if (storedTime && Number(storedTime) > 0) {
        var diffTime = new Date(new Date().getTime() - Number(storedTime));    
        if (diffTime.getUTCHours() > 0 || diffTime.getDate() > 1 || diffTime.getYear() > 70) {
            resetNeed = true;
            sessionStorage.removeItem("lc_storedtime");
            sessionStorage.removeItem("lc_currentUserCustomInfo");
            sessionStorage.removeItem("lc_currentUserProfilesInfo");
            sessionStorage.removeItem("lc_currentUserProfilesDetailsInfo");
        } else {
            resetNeed = false;
            var _objcurrentUserCustomInfo = JSON.parse(sessionStorage.getItem("lc_currentUserCustomInfo"));
            if (_objcurrentUserCustomInfo && _objcurrentUserCustomInfo != null)
            {
                currentUserCustomInfo = _objcurrentUserCustomInfo;
            }
            var _objcurrentUserProfilesInfo = JSON.parse(sessionStorage.getItem("lc_currentUserProfilesInfo"));
            if (_objcurrentUserProfilesInfo && _objcurrentUserProfilesInfo != null) {
                currentUserProfilesInfo = _objcurrentUserProfilesInfo;
            }
            var _objcurrentUserProfilesDetailsInfo = JSON.parse(sessionStorage.getItem("lc_currentUserProfilesDetailsInfo"));
            if (_objcurrentUserProfilesDetailsInfo && _objcurrentUserProfilesDetailsInfo != null) {
                currentUserProfilesDetailsInfo = _objcurrentUserProfilesDetailsInfo;
            }
        }

    }

    resetNeed = true;

    if (resetNeed === true) {
        // in Case Session not found or Expired

        GetSPListItems("Users", 0, "LoginIDId eq " + _spPageContextInfo.userId, false)
            .done(function (data) {
                if (data.d && data.d.results.length > 0) {

                    currentUserCustomInfo = data.d.results[0];


                    //// new permissions
                    //currentUserCustomInfo.IsIMSUser = false;
                    //currentUserCustomInfo.CanViewMasterLog = false;

                    currentUserCustomInfo.SPGroups = null;
                    /*
                    getUserAssignSPGroups(_spPageContextInfo.userId).done(function (response) {
                        if (response.d != null && response.d.results.length) {
                            currentUserCustomInfo.SPGroups = response.d.results;
    
                            var imsGroup = currentUserCustomInfo.SPGroups.filter(function (a) { return a.Title == "Dejavu_IMS_Users" });
                            if (imsGroup != null && imsGroup.length > 0) {
                                currentUserCustomInfo.IsIMSUser = true;
                            }
                            
    
                        }
                    });*/



                    sessionStorage.setItem("lc_storedtime", new Date().getTime());
                    sessionStorage.setItem("lc_currentUserCustomInfo", JSON.stringify(currentUserCustomInfo));
                    //sessionStorage.setItem("lc_currentUserProfilesInfo", JSON.stringify(currentUserProfilesInfo));
                    //sessionStorage.setItem("lc_currentUserProfilesDetailsInfo", JSON.stringify(currentUserProfilesDetailsInfo));


                    currentUserProfilesInfo = [];
                    currentUserProfilesDetailsInfo = [];

                    getCurrentUserProfiles();
                    getCurrentUserProfileDetailsRights();
                }
            }).fail(function (data) {
                currentUserCustomInfo = null;
            });
    }
    try{
        showUpdatedNotifications();
    } catch (ex) {
        console.log(ex);
    }
}


function getCurrentUserProfiles() {

    for (var pindex = 0; pindex < currentUserCustomInfo.ProfileLookupId.results.length; pindex++) {
        var pid = currentUserCustomInfo.ProfileLookupId.results[pindex];
        if (Number(pid) > 0) {
            GetSPListItems("Profiles", pid, "", false).done(function (response) {
                if (response.d != null) {
                    currentUserProfilesInfo.push(response.d);

                    sessionStorage.setItem("lc_currentUserProfilesInfo", JSON.stringify(currentUserProfilesInfo));
                    
                }
            });
        }
    }
}


function getCurrentUserProfileDetailsRights() {
    
    for (var pindex = 0; pindex < currentUserCustomInfo.ProfileLookupId.results.length; pindex++) {
        var pid = currentUserCustomInfo.ProfileLookupId.results[pindex];
        if (Number(pid) > 0) {
            validationFilter = "ProfileLookupId eq " + pid + "&$top=5000";
            GetSPListItems("ProfileRights", 0, validationFilter, false).done(function (response) {
                if (response.d.results.length > 0) {
                    currentUserProfilesDetailsInfo.push(response.d.results);

                    sessionStorage.setItem("lc_currentUserProfilesDetailsInfo", JSON.stringify(currentUserProfilesDetailsInfo));
                }
            });
        }
    }
}


const Module = {
    ProductManagement: "Product Management",
    CompanyCredentials: "Credential Management",
    Artwork: "Artwork",
    LotRelease: "LotRelease",
    Agreement: "Agreement",
    ShowCause: "ShowCause",
    PricingDatabase: "PricingDatabase"
};
const Permission = {
    VIEW: 1,
    UPLOAD: 2,
    DOWNLOAD: 3,
    ProductRegistrationFullReport: 4,
    CompanyCredentialFullReport: 5,
    ArtworkFullReport: 6,
    DossierTrail_PRCReport: 7,
    Share: 8,
    Approve: 9,
    Report: 10
};
function haveAccessTo(_module, _countryId) {

    var haveAccess = false;
    try {
        if (currentUserCustomInfo && Number(currentUserCustomInfo.Id) > 0 ) {


            //if (currentUserProfilesInfo && currentUserProfilesInfo.length > 0) {

            //var _modulePermissions = currentUserProfilesInfo.filter("ModuleType = " + _module);
            if (currentUserProfilesDetailsInfo && currentUserProfilesDetailsInfo.length > 0) {

                if (Number(_countryId) > 0) {

                    //var _modulePermissions = currentUserProfilesDetailsInfo.filter(function (a) { return a.ModuleType == _module && a.CountryLookupId == _countryId });
                    currentUserProfilesDetailsInfo.forEach(function (_DetailsInfo) {
                        var _modulePermissions = _DetailsInfo.filter(function (a) { return a.ModuleType == _module && a.CountryLookupId == _countryId });
                        if (_modulePermissions != null && _modulePermissions.length > 0) {
                            haveAccess = true;
                        }

                    });
                } else {
                    
                    currentUserProfilesDetailsInfo.forEach(function (_DetailsInfo) {
                        var _modulePermissions = _DetailsInfo.filter(function (a) { return a.ModuleType == _module });
                        if (_modulePermissions != null && _modulePermissions.length > 0) {
                            haveAccess = true;
                        }

                    });
                }

                /*
                currentUserProfilesInfo.forEach(function (a) {

                    switch (_module.toLowerCase()) {

                        case 'company':
                            if (a.CompanyLookupId.results.length > 0) {
                                haveAccess = haveAccess || a.CompanyLookupId.results.includes(_id);
                            }
                            break;

                        case 'plant':
                            if (a.PlantLookupId.results.length > 0) {
                                haveAccess = haveAccess || a.PlantLookupId.results.includes(_id);
                            }
                            break;

                        case 'department':
                            if (a.DepartmentsId.results.length > 0) {
                                haveAccess = haveAccess || a.DepartmentsId.results.includes(_id);
                            }
                            break;
                    }

                });*/
            }


            /*
            if (currentUserProfilesInfo && currentUserProfilesInfo.length > 0) {
                currentUserProfilesInfo.forEach(function (a) {
                    if (a.PlantLookupId.results.length > 0) {
                        for (var cindex = 0; cindex < a.PlantLookupId.results.length; cindex++) {
                            var pid = a.PlantLookupId.results[cindex];
                            if (Number(pid) > 0) {
                                plantsFilter = plantsFilter + (plantsFilter.length > 0 ? " or " : "") + " Id eq " + pid + " ";
                            }
                        }
                    }
                });
            }*/

        }
        /*else if (currentUserCustomInfo && Number(currentUserCustomInfo.Id) > 0 && currentUserCustomInfo.UserType == 'Admin') {
            haveAccess = true;
        }*/
    } catch (ex) {
        console.error("Error on haveAccessTo(" + _module + "," + _id + ")", ex.message);
    }

    return haveAccess;
}

function havePremission(_type, _moduleType, _countryid) {

    var allow = false;
    try {
        
        if (currentUserCustomInfo && currentUserCustomInfo != null && currentUserProfilesDetailsInfo && currentUserProfilesDetailsInfo != null) {

            if (_countryid && Number(_countryid) > 0) {
                if (currentUserProfilesInfo && currentUserProfilesInfo.length > 0) {
                    currentUserProfilesInfo.forEach(function (profile) {
                        if (profile.CountryLookupId.results.includes(Number(_countryid)) == true) {

                            currentUserProfilesDetailsInfo.forEach(function (_DetailsInfo) {
                                
                                var ProfileRigthsInfolst = _DetailsInfo.filter(function (a) { return a.ProfileLookupId == profile.Id && a.ModuleType == _moduleType && a.CountryLookupId == _countryid });

                                if (ProfileRigthsInfolst && ProfileRigthsInfolst.length > 0) {

                                    var _lst = [];

                                    switch (_type) {

                                        case Permission.VIEW:
                                            _lst = ProfileRigthsInfolst.filter(function (b) { return b.Isview == true; });
                                            break;
                                        case Permission.UPLOAD:
                                            _lst = ProfileRigthsInfolst.filter(function (b) { return b.Isupload == true; });
                                            break;
                                        case Permission.DOWNLOAD:
                                            _lst = ProfileRigthsInfolst.filter(function (b) { return b.Isdownload == true; });
                                            break;
                                        case Permission.Share:
                                            _lst = ProfileRigthsInfolst.filter(function (b) { return b.Isshare == true; });
                                            break;
                                        case Permission.Approve:
                                            _lst = ProfileRigthsInfolst.filter(function (b) { return b.CanApprove == true; });
                                            break;
                                        case Permission.Report:
                                            _lst = ProfileRigthsInfolst.filter(function (b) { return b.Report == true; });
                                            break;
                                        case Permission.ProductRegistrationFullReport:
                                            _lst = ProfileRigthsInfolst.filter(function (b) { return b.ProductRegistrationFullReport == true; });
                                            break;
                                        case Permission.CompanyCredentialFullReport:
                                            _lst = ProfileRigthsInfolst.filter(function (b) { return b.CompanyCredentialFullReport == true; });
                                            break;
                                        case Permission.ArtworkFullReport:
                                            _lst = ProfileRigthsInfolst.filter(function (b) { return b.ArtworkFullReport == true; });
                                            break;
                                        case Permission.DossierTrail_PRCReport:
                                            _lst = ProfileRigthsInfolst.filter(function (b) { return b.DossierTrail_PRCReport == true; });
                                            break;

                                        default:
                                            _lst = [];
                                            break;
                                    }


                                    if (_lst && _lst != null ) {
                                        allow = allow || (_lst.length > 0);
                                    }
                                    /*
                                    ProfileRigthsInfolst.forEach(function (profileRigths) {
                                        if (profileRigths && profileRigths.length > 0) {
                                            profileRigths.forEach(function (details) {

                                                switch (_type) {

                                                    case Permission.VIEW:
                                                        allow = allow || details.Isview;
                                                        break;
                                                    case Permission.UPLOAD:
                                                        allow = allow || details.Isupload;
                                                        break;
                                                    case Permission.DOWNLOAD:
                                                        allow = allow || details.Isdownload;
                                                        break;
                                                    case Permission.Share:
                                                        allow = allow || details.Isshare;
                                                        break;
                                                    case Permission.Approve:
                                                        allow = allow || details.CanApprove;
                                                        break;
                                                    case Permission.ProductRegistrationFullReport:
                                                        allow = allow || details.ProductRegistrationFullReport;
                                                        break;
                                                    case Permission.CompanyCredentialFullReport:
                                                        allow = allow || details.CompanyCredentialFullReport;
                                                        break;
                                                    case Permission.ArtworkFullReport:
                                                        allow = allow || details.ArtworkFullReport;
                                                        break;
                                                    case Permission.DossierTrail_PRCReport:
                                                        allow = allow || details.DossierTrail_PRCReport;
                                                        break;

                                                    default:
                                                        allow = false;
                                                        break;
                                                }

                                            });
                                        }

                                    });*/
                                }

                            });


                        }
                    });
                }
            } else {
                currentUserProfilesDetailsInfo.forEach(function (_DetailsInfo) {
                    var ProfileRigthsInfolst = _DetailsInfo.filter(function (a) { return a.ModuleType == _moduleType });
                    if (ProfileRigthsInfolst && ProfileRigthsInfolst.length > 0) {



                        var _lst = [];

                        switch (_type) {

                            case Permission.VIEW:
                                _lst = ProfileRigthsInfolst.filter(function (b) { return b.Isview == true; });
                                break;
                            case Permission.UPLOAD:
                                _lst = ProfileRigthsInfolst.filter(function (b) { return b.Isupload == true; });
                                break;
                            case Permission.DOWNLOAD:
                                _lst = ProfileRigthsInfolst.filter(function (b) { return b.Isdownload == true; });
                                break;
                            case Permission.Share:
                                _lst = ProfileRigthsInfolst.filter(function (b) { return b.Isshare == true; });
                                break;
                            case Permission.Approve:
                                _lst = ProfileRigthsInfolst.filter(function (b) { return b.CanApprove == true; });
                                break;
                            case Permission.Report:
                                _lst = ProfileRigthsInfolst.filter(function (b) { return b.Report == true; });
                                break;
                            case Permission.ProductRegistrationFullReport:
                                _lst = ProfileRigthsInfolst.filter(function (b) { return b.ProductRegistrationFullReport == true; });
                                break;
                            case Permission.CompanyCredentialFullReport:
                                _lst = ProfileRigthsInfolst.filter(function (b) { return b.CompanyCredentialFullReport == true; });
                                break;
                            case Permission.ArtworkFullReport:
                                _lst = ProfileRigthsInfolst.filter(function (b) { return b.ArtworkFullReport == true; });
                                break;
                            case Permission.DossierTrail_PRCReport:
                                _lst = ProfileRigthsInfolst.filter(function (b) { return b.DossierTrail_PRCReport == true; });
                                break;

                            default:
                                _lst = [];
                                break;
                        }

                        if (_lst && _lst != null) {
                            allow = allow || (_lst.length > 0);
                        }

                        /*ProfileRigthsInfolst.forEach(function (profileRigths) {
                            if (profileRigths && profileRigths.length > 0) {
                                profileRigths.forEach(function (details) {

                                    switch (_type) {

                                        case Permission.VIEW:
                                            allow = allow || details.Isview;
                                            break;
                                        case Permission.UPLOAD:
                                            allow = allow || details.Isupload;
                                            break;
                                        case Permission.DOWNLOAD:
                                            allow = allow || details.Isdownload;
                                            break;
                                        case Permission.Share:
                                            allow = allow || details.Isshare;
                                            break;
                                        case Permission.Approve:
                                            allow = allow || details.CanApprove;
                                            break;
                                        case Permission.ProductRegistrationFullReport:
                                            allow = allow || details.ProductRegistrationFullReport;
                                            break;
                                        case Permission.CompanyCredentialFullReport:
                                            allow = allow || details.CompanyCredentialFullReport;
                                            break;
                                        case Permission.ArtworkFullReport:
                                            allow = allow || details.ArtworkFullReport;
                                            break;
                                        case Permission.DossierTrail_PRCReport:
                                            allow = allow || details.DossierTrail_PRCReport;
                                            break;

                                        default:
                                            allow = false;
                                            break;
                                    }

                                });
                            }

                        });*/
                    }
                });
            }
        } 
        /*else {
            allow = true;
        }*/

    } catch (ex) {
        console.error("Error on havePremission(" + _type + "," + _countryid + ")", ex.message);
    }

    return allow;
}


function toDisplayName(s) {
    s = s.substring(0, s.indexOf('(')).trim();
    return s;
}

// Date formats

function parseISOString(s) {
    var b = s.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

function toDisplayDate(s) {
    var d = '';
    if (typeof (s) != 'undefined' && s != null) {
        var d = parseISOString(s);

        d = d.toShortFormat();
    }
    return d
}

function toDisplayDateTime(s) {
    var d = '';
    if (typeof (s) != 'undefined' && s != null) {
        d = parseISOString(s);

        d = d.toShortDateTime();
    }
    return d
}


function getDataTableSortableDateTime(s) {
    var strHTML = '';
    if (typeof (s) != 'undefined' && s != null) {
        var d = parseISOString(s);

        if (typeof (d) != 'undefined' && d != null) {


            let day = d.getDate();
            let month = d.getMonth() + 1;
            let year = d.getFullYear();

            strHTML = ('00' + year).substr(-2) + '' + ('00' + month).substr(-2) + '' + ('00' + day).substr(-2) + '' + ('00' + d.getHours()).substr(-2) + '' + ('00' + d.getMinutes()).substr(-2) + ('00' + d.getSeconds()).substr(-2);
            strHTML = "<span style='display:none;'>" + strHTML + "</span>";
        }
    }
    return strHTML;
}

Date.prototype.toShortFormat = function() {

    let monthNames =["Jan","Feb","Mar","Apr",
                      "May","Jun","Jul","Aug",
                      "Sep", "Oct","Nov","Dec"];
    
    let day = this.getDate();
    
    let monthIndex = this.getMonth();
    let monthName = monthNames[monthIndex];
    
    let year = this.getFullYear();
    
    return day + '-' + monthName + '-' + year;
}

Date.prototype.toShortDateTime = function () {

    let monthNames = ["Jan", "Feb", "Mar", "Apr",
                      "May", "Jun", "Jul", "Aug",
                      "Sep", "Oct", "Nov", "Dec"];

    let day = this.getDate();

    let monthIndex = this.getMonth();
    let monthName = monthNames[monthIndex];

    let year = this.getFullYear();
    let amorpm = this.getHours() > 12 ? 'pm' : 'am';
    return day + '-' + monthName + '-' + year + ' ' + ('00' + this.getHours()).substr(-2) + ':' + ('00' + this.getMinutes()).substr(-2) + ' ' + amorpm;
}




function RequestEnded(sender, args) {
    try {
        waitDialog.close();
        waitDialog = null;
    } catch (ex) { }
};

function RequestStarted(sender, args) {
    ExecuteOrDelayUntilScriptLoaded(ShowWaitDialog, "sp.js");
};

function commonError(data) {
    console.log("Error: ", data);    
}


function ShowWaitDialog() {
    try {
        if (typeof(waitDialog) == 'undefined' || waitDialog == null) {
            waitDialog = SP.UI.ModalDialog.showWaitScreenWithNoClose('Processing...', 'Please wait while request is in progress...', 150, 330);
        }
    } catch (ex) { }
}

function openNewItemDialog(listName, title, source, queryString, successMsg, _width, needToReloadPage, _callBackFunc) {
    if (typeof (_width) == "undefined") { _width = 650; }
    if (typeof (needToReloadPage) == "undefined") { needToReloadPage = true; }

    var options = {
        title: title,
        //url: _spPageContextInfo.webAbsoluteUrl + "/Lists/" + listName + "/NewForm.aspx?Source=" + source + queryString,
        url: _spPageContextInfo.webAbsoluteUrl + "/Lists/" + listName + "/NewForm.aspx?" + queryString,
        allowMaximize: true,
        width: _width        
    };


    if (needToReloadPage == true) {
        options.dialogReturnValueCallback = function (dialogResult, returnValue) {
            if (dialogResult == 1) {
                //SP.UI.Notify.addNotification('New item is added');
                if (successMsg && successMsg.length > 0)
                    alert(successMsg);

                if ((typeof (_dialogReturnValueCallback) == "function")) { _dialogReturnValueCallback(dialogResult, returnValue); _dialogReturnValueCallback = null; }

                SP.UI.ModalDialog.RefreshPage(SP.UI.DialogResult.OK);
            }
        }
    } else {
        options.dialogReturnValueCallback = _callBackFunc;
    }

    //_dialogReturnValueCallback = _callBackFunc;

    SP.SOD.execute('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', options);

    SP.SOD.executeFunc('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', function () {
        $(".ms-dlgTitleBtns").css('margin-right', '0px');
        $("#s4-bodyContainer").css('min-height', 'auto');
    });
}
function openEditItemDialog(listName, itemID, title, queryString, successMsg, needToReloadPage, _callBackFunc) {
    queryString = queryString.length > 0 ? "&" + queryString : "";
    if (typeof (needToReloadPage) == "undefined") { needToReloadPage = true; }

    var options = {
        title: title,
        url: _spPageContextInfo.webAbsoluteUrl + "/Lists/" + listName + "/EditForm.aspx?ID=" + itemID + queryString,
        allowMaximize: true
    };
    

    if (needToReloadPage == true) {
        options.dialogReturnValueCallback = function (dialogResult, returnValue) {
            if (dialogResult == 1) {
                //SP.UI.Notify.addNotification('Something has changed');
                if (successMsg && successMsg.length > 0)
                    alert(successMsg);
                
                if ((typeof (_dialogReturnValueCallback) == "function")) { _dialogReturnValueCallback(dialogResult, returnValue); _dialogReturnValueCallback = null; }

                SP.UI.ModalDialog.RefreshPage(SP.UI.DialogResult.OK);

            }
        }
    } else {
        options.dialogReturnValueCallback = _callBackFunc;
    }


    SP.SOD.execute('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', options);

    SP.SOD.executeFunc('sp.ui.dialog.js', 'SP.UI.ModalDialog.showModalDialog', function () {
        $(".ms-dlgTitleBtns").css('margin-right', '0px');
    });
}


function isPageAccessableCommon() {
    var haverighttovisitthispage = false;

    try {
        var thispageurlarry = document.location.pathname.split('.aspx')[0].split('/');
        var thispagename = decodeURI(thispageurlarry[thispageurlarry.length - 1] + '.aspx').toLowerCase();
        

        var pageNameArry = [
            "Home.aspx",
            "Dashboard.aspx",
            "Products.aspx",
            "CompanyCredentialsShare.aspx",
            "Artwork.aspx",
            "SharedArtwork.aspx",
            "Credential%20Management.aspx",
            "Lot Release.aspx",
            "Agreements.aspx",
            "AdminApproval.aspx",
            "User%20Management.aspx",
            "Profiles.aspx",
            "ProductReport.aspx",
            "ReportArtwork.aspx",
            "CredentialsReport.aspx",
            "Agreement%20Report.aspx",
            "LotReleaseReport.aspx",
            "ShowCause.aspx",
            "ShowCaseDashboard.aspx",
            "Showcause%20Report.aspx",
            "Pricing%20Database.aspx",
            "Pricing%20Database%20Details.aspx",
            "Pricing%20Database%20Report.aspx",
            "AdminMenu.aspx"]



        if (thispagename == "Notifications.aspx".toLowerCase()) {
            if (haveAccessTo(Module.ProductManagement) == true ||
                haveAccessTo(Module.Artwork) == true || 
                haveAccessTo(Module.CompanyCredentials) == true) {
                haverighttovisitthispage = true;
            }
        }



        if (thispagename == "Artwork.aspx".toLowerCase() ||
           thispagename == "SharedArtwork.aspx".toLowerCase() ||
           thispagename == "ReportArtwork.aspx".toLowerCase() ||
           thispagename == "Dashboard.aspx".toLowerCase() ||
           thispagename == "Home.aspx".toLowerCase()) {
            if (haveAccessTo(Module.Artwork) == true) {
                haverighttovisitthispage = true;
            }
        }

        if (thispagename == "Products.aspx".toLowerCase() ||
            thispagename == "ProductDashboard.aspx".toLowerCase() ||
            thispagename == "CompanyCredentialsShare.aspx".toLowerCase() ||
            thispagename == "ProductReport.aspx".toLowerCase() ||
            thispagename == "Dashboard.aspx".toLowerCase() ||
           thispagename == "Home.aspx".toLowerCase()) {
            if (haveAccessTo(Module.ProductManagement) == true) {
                haverighttovisitthispage = true;
            }
        }

        if (thispagename == "Credential Management.aspx".toLowerCase() ||
            thispagename == "CompanyCredentialsShare.aspx".toLowerCase() ||
            thispagename == "CredentialsReport.aspx".toLowerCase() ||
            thispagename == "Dashboard.aspx".toLowerCase() ||
           thispagename == "Home.aspx".toLowerCase()) {
            if (haveAccessTo(Module.CompanyCredentials) == true) {
                haverighttovisitthispage = true;
            }
        }

        if (thispagename == "Lot Release.aspx".toLowerCase() ||
            thispagename == "Dashboard.aspx".toLowerCase() ||
           thispagename == "Home.aspx".toLowerCase()) {
            if (haveAccessTo(Module.LotRelease) == true) {
                haverighttovisitthispage = true;
            }
        }

        if (thispagename == "Agreements.aspx".toLowerCase() ||
            thispagename == "Dashboard.aspx".toLowerCase() ||
           thispagename == "Home.aspx".toLowerCase()) {
            if (haveAccessTo(Module.Agreement) == true) {
                haverighttovisitthispage = true;
            }
        }

        if (thispagename == "Agreement Report.aspx".toLowerCase()) {
            if (havePremission(Permission.Report, Module.Agreement) == true) {
                haverighttovisitthispage = true;
            }
        }


        if (thispagename == "LotReleaseReport.aspx".toLowerCase()) {
            if (havePremission(Permission.Report, Module.LotRelease) == true) {
                haverighttovisitthispage = true;
            }
        }

        if (thispagename == "ReportTrail.aspx".toLowerCase()) {
            if (havePremission(Permission.DossierTrail_PRCReport, Module.ProductManagement) == true) {
                haverighttovisitthispage = true;
            }
        }
        
        if (thispagename == "AdminApproval.aspx".toLowerCase()) {
            
            if (havePremission(Permission.Approve, Module.ProductManagement) == true ||
                havePremission(Permission.Approve, Module.Artwork) == true ||
                havePremission(Permission.Approve, Module.CompanyCredentials) == true ||
                havePremission(Permission.Approve, Module.LotRelease) == true ||
                havePremission(Permission.Approve, Module.Agreement) == true) {

                haverighttovisitthispage = true;
            }
        }

        
        if (thispagename == "User Management.aspx".toLowerCase() ||
            thispagename == "Profiles.aspx".toLowerCase() ||
            thispagename == "ProfileDetails.aspx".toLowerCase() || 
            thispagename == "AdminMenu.aspx".toLowerCase()) {
            if (currentUserCustomInfo.UserType == 'Admin') {
                haverighttovisitthispage = true;
            }
        }

        

        if (thispagename == "AccessDenied.aspx".toLowerCase() ||
            thispagename == "NewForm.aspx".toLowerCase() ||
            thispagename == "EditForm.aspx".toLowerCase()) {
            
            haverighttovisitthispage = true;

        }
        


        if (thispagename == "Dashboard.aspx".toLowerCase() ||
            thispagename == "Home.aspx".toLowerCase()) {
            if (haveAccessTo(Module.ProductManagement) == true || 
                haveAccessTo(Module.CompanyCredentials) == true ||
                haveAccessTo(Module.Artwork) == true ||
                haveAccessTo(Module.LotRelease) == true ||
                haveAccessTo(Module.Agreement) == true) {

                haverighttovisitthispage = true;
            }
        }



        if (thispagename == "ShowCause.aspx".toLowerCase()||
            thispagename == "ShowCaseDashboard.aspx".toLowerCase()) {
           
            if (haveAccessTo(Module.ShowCause)) {

                haverighttovisitthispage = true;
            }
        }



        if (thispagename == "Showcause Report.aspx".toLowerCase()) {

            if (havePremission(Permission.Report, Module.ShowCause) == true) {

                haverighttovisitthispage = true;
            }
        }


        if (thispagename == "Pricing Database.aspx".toLowerCase() ||
            thispagename == "Pricing Database Details.aspx".toLowerCase()) {
            
            if (havePremission(Permission.VIEW, Module.PricingDatabase) == true||
                havePremission(Permission.UPLOAD, Module.PricingDatabase) == true||
                havePremission(Permission.DOWNLOAD, Module.PricingDatabase) == true) {

                haverighttovisitthispage = true;
            }
        }
        
        if (thispagename == "Pricing Database Report.aspx".toLowerCase()) {
            
            if (havePremission(Permission.Report, Module.PricingDatabase) == true) {

                haverighttovisitthispage = true;
            }
        }

    } catch (ex) { }

    if (haverighttovisitthispage == false) {
        document.location = _spPageContextInfo.webAbsoluteUrl + "/SitePages/AccessDenied.aspx";
    }
}

function showSiteMenu() {
    if (GetQueryString("IsDlg") == '') {

        var menuhtml = "";


            menuhtml = "<div class='list-group'>" +
                            "<div id='div_admin'>";


            menuhtml = menuhtml + "<a href='Home.aspx' class='list-group-item'>" +
                                    "<i class='glyphicon glyphicon-home'></i>&nbsp;Home" +
                                    "</a>";


            if (haveAccessTo(Module.ProductManagement) == true) {
                menuhtml = menuhtml +
                                        "<a id='link_ManageProduct' href='Products.aspx' class='list-group-item' title='Product Management'>" +
                                        "<i class='glyphicon glyphicon-barcode'></i>&nbsp;Product Management" +
                                        "</a>";
            }
            if (haveAccessTo(Module.ProductManagement) == true ||
                haveAccessTo(Module.CompanyCredentials) == true) {
            menuhtml = menuhtml +
                                    "<a href='CompanyCredentialsShare.aspx' class='list-group-item'>" +
                                    "<i class='glyphicon glyphicon-inbox'></i>&nbsp;Shared Docs/Certificate" +
                                    "</a>";

                
            }
            if (haveAccessTo(Module.Artwork) == true) {
            menuhtml = menuhtml +
                                    "<a href='Artwork.aspx' class='list-group-item'>" +
                                    "<i class='glyphicon glyphicon-picture'></i>&nbsp;Artwork" +
                                    "</a>" +
                                    "<a href='SharedArtwork.aspx' class='list-group-item'>" +
                                    "<i class='glyphicon glyphicon-inbox'></i>&nbsp;Shared Artwork" +
                                    "</a>";

                
            }
            if (haveAccessTo(Module.CompanyCredentials) == true) {
                menuhtml = menuhtml + "<a href='Credential%20Management.aspx' class='list-group-item'>" +
                                    "<i class='glyphicon glyphicon-briefcase'></i>&nbsp;Credential Management" +
                                    "</a>";
                
            }
            if (haveAccessTo(Module.LotRelease) == true) {
            menuhtml = menuhtml +
                                    "<a href='Lot Release.aspx' class='list-group-item'>" +
                                    "<i class='glyphicon glyphicon-indent-left'></i>&nbsp;Lot Release" +
                                    "</a>";
                
            }
            if (haveAccessTo(Module.Agreement) == true) {
            menuhtml = menuhtml +
                                    "<a href='Agreements.aspx' class='list-group-item'>" +
                                    "<i class='glyphicon glyphicon-leaf'></i>&nbsp;Agreements" +
                                    "</a>";
                                
            }
            if (haveAccessTo(Module.ShowCause) == true) {
                menuhtml = menuhtml +
                                        "<a href='ShowCause.aspx' class='list-group-item'>" +
                                        "<i class='glyphicon glyphicon-calendar'></i>&nbsp;Showcause Notices" +
                                        "</a>";

            }
        
            if (havePremission(Permission.VIEW, Module.PricingDatabase) == true||
                havePremission(Permission.UPLOAD, Module.PricingDatabase) == true||
                havePremission(Permission.DOWNLOAD, Module.PricingDatabase) == true) {

                menuhtml = menuhtml +
                                        "<a href='Pricing Database.aspx' class='list-group-item'>" +
                                        "<i class='glyphicon glyphicon-calendar'></i>&nbsp;Pricing Database" +
                                        "</a>";

            }
        

            if (havePremission(Permission.Approve, Module.ProductManagement) == true ||
                havePremission(Permission.Approve, Module.Artwork) == true ||
                havePremission(Permission.Approve, Module.CompanyCredentials) == true ||
                havePremission(Permission.Approve, Module.LotRelease) == true ||
                havePremission(Permission.Approve, Module.Agreement) == true) {
            menuhtml = menuhtml +
                                    "<a href='AdminApproval.aspx' class='list-group-item'>" +
                                    "<i class='glyphicon glyphicon-ok'></i>&nbsp;Admin Approval" +
                                    "</a>";

                
            }
            if (currentUserCustomInfo.UserType == 'Admin') {

            menuhtml = menuhtml +
                                    "<a href='User%20Management.aspx' class='list-group-item'>" +
                                    "<i class='glyphicon glyphicon-user'></i>&nbsp;User Management" +
                                    "</a>" +
                                    "<a href='Profiles.aspx' class='list-group-item'>" +
                                    "<i class='glyphicon glyphicon-paperclip'></i>&nbsp;User Profile" +
                                    "</a>" +
                                    "<a href='AdminMenu.aspx' class='list-group-item'>" +
                                    "<i class='glyphicon glyphicon-paperclip'></i>&nbsp;Configuration" +
                                    "</a>";

                
            }

            menuhtml = menuhtml +
                                        "<div id='div_Reports' class='list-group-item menu-splitter' title='Reports'>" +
                                        "Reports" +
                                        "</div>";

            if (havePremission(Permission.ProductRegistrationFullReport, Module.ProductManagement) == true) {
                menuhtml = menuhtml +
                                    "<a id='link_ReportProducts' href='ProductReport.aspx' class='list-group-item menu-indent' title='Product Report'>" +
                                    "<i class='glyphicon glyphicon-list-alt'></i>&nbsp;Product Report" +
                                    "</a>";
                
            }
            if (havePremission(Permission.ArtworkFullReport, Module.Artwork) == true) {
                menuhtml = menuhtml +
                                    "<a id='link_ReportArtwork' href='ReportArtwork.aspx' class='list-group-item menu-indent' title='Artwork Report'>" +
                                    "<i class='glyphicon glyphicon-list-alt'></i>&nbsp;Artwork Report" +
                                    "</a>";

                
            }
            if (havePremission(Permission.CompanyCredentialFullReport, Module.CompanyCredentials) == true) {
                menuhtml = menuhtml +
                                        "<a id='link_ReportCredentials' href='CredentialsReport.aspx' class='list-group-item menu-indent' title='Company Credentials Report'>" +
                                        "<i class='glyphicon glyphicon-list-alt'></i>&nbsp;Company Credentials Report" +
                                        "</a>";
            }
            if (havePremission(Permission.Report, Module.Agreement) == true) {
                menuhtml = menuhtml +
                                        "<a id='link_ReportAgreement' href='Agreement Report.aspx' class='list-group-item menu-indent' title='Agreement Report'>" +
                                        "<i class='glyphicon glyphicon-list-alt'></i>&nbsp;Agreement Report" +
                                        "</a>";
            }
            if (havePremission(Permission.Report, Module.LotRelease) == true) {
                menuhtml = menuhtml +
                                        "<a id='link_ReportLotRelease' href='LotReleaseReport.aspx' class='list-group-item menu-indent' title='Lot Release Report'>" +
                                        "<i class='glyphicon glyphicon-list-alt'></i>&nbsp;Lot Release Report" +
                                        "</a>";
            }
            if (havePremission(Permission.Report, Module.ShowCause) == true) {
                menuhtml = menuhtml +
                                        "<a id='link_ReportShowcause' href='Showcause%20Report.aspx' class='list-group-item menu-indent' title='Showcause Notices Report'>" +
                                        "<i class='glyphicon glyphicon-list-alt'></i>&nbsp;Showcause Notices Report" +
                                        "</a>";
            }
        
            if (havePremission(Permission.Report, Module.PricingDatabase) == true) {
                menuhtml = menuhtml +
                                        "<a id='link_ReportPricingDatabase' href='Pricing%20Database%20Report.aspx' class='list-group-item menu-indent' title='Pricing Database Report'>" +
                                        "<i class='glyphicon glyphicon-list-alt'></i>&nbsp;Pricing Database Report" +
                                        "</a>";
            }
                  
                    
            menuhtml = menuhtml +
                            "</div>" +
                        "</div>";

        $("#customSiteMenu").html(menuhtml);
        //$("#customSiteMenu").css('min-width', '198px');
        $("#DeltaHorizontalQuickLaunch").hide();

    }
}



function saveActionLog(_recordId, _comments, _action, _module) {

    var jsonData1 = {
        Title: "",
        Comments: _comments,
        ActionName: _action
    }

    if (_module == Module.ProductManagement) {
        jsonData1.ProductLookupId = _recordId;
        jsonData1.Module = _module;
    }
    else if (_module == Module.Artwork) {
        jsonData1.ArtworkLookupId = _recordId;
        jsonData1.Module = _module;
    }
    else if (_module == Module.CompanyCredentials) {
        jsonData1.CredentialLookupId = _recordId;
        jsonData1.Module = _module;
    }
    else if (_module == Module.LotRelease) {
        jsonData1.LotReleaseLookupId = _recordId;
        jsonData1.Module = _module;
    }

    if (jsonData1.Module && jsonData1.Module.length > 0) {
        InsertIntoSPList("ActionLogs", jsonData1).done(function (data) {
        });
    }
}



function showLoader() {
    var _loader_html = "<div id='custom-loader' class='loader-container'><div class='loader'></div></div>";

    $('body').append(_loader_html);
}

function hideLoader() {
    $('body').find("#custom-loader").remove();
}

    var partialLoader = "<div class='partial-loader'><div class='loader'> </div> Loading...</div>";
