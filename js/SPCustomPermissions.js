// Change placeholder values before you run this code.
var siteUrl = _spPageContextInfo.webAbsoluteUrl;
var targetDocumentLibraryName = 'List 1';

var targetRoleDefinitionName = 'View Only';
var groupId;
var targetRoleDefinitionId;
var profileRecordID;

//$(document).ready( function() {
//  getTargetGroupId();
//});


// Get the ID of the target group.
function getTargetGroupId(groupName) {
  $.ajax({
    url: siteUrl + '/_api/web/sitegroups/getbyname(\'' + groupName + '\')/id',
    type: 'GET',
    headers: { 'accept':'application/json;odata=verbose' },
    success: function(responseData) {
      groupId = responseData.d.Id;
      getTargetRoleDefinitionId();
    },
    error: errorHandler
  });
}



// Get the ID of the role definition that defines the permissions
// you want to assign to the group.
function addSPGroup(_profileRecordID, groupName, description) {

    profileRecordID = _profileRecordID;

    $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/sitegroups",
        type: "POST",
        data: JSON.stringify({
            "__metadata": {
                "type": "SP.Group"
            },
            "Title": groupName,
            "Description": description
        }),
        headers: {
            "Accept": "application/json; odata=verbose",
            "Content-Type": "application/json; odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        },
        success: function (data) {
            if (data.d && data.d.Id > 0) {
                groupId = data.d.Id;

                var dataItem = {
                    "ProfileGroupTitle": ""+ data.d.Title,
                    "ProfileGroupID": "" + groupId
                };
                UpdateSPList("Profiles", profileRecordID, dataItem).done(function (data) {                    
                    console.log("Profile Assign", data);
                });

                getTargetRoleDefinitionId(targetRoleDefinitionName);
                
                console.log("Insert sitegroups() Success", data);
            }
        },
        error: function (data) {
            console.log("Insert sitegroups() Error", data);
        }
    });
}

// Get the ID of the role definition that defines the permissions
// you want to assign to the group.
function getTargetRoleDefinitionId(targetRoleDefinitionName) {
  $.ajax({
    url: siteUrl + '/_api/web/roledefinitions/getbyname(\''
        + targetRoleDefinitionName + '\')/id',
    type: 'GET',
    headers: { 'accept':'application/json;odata=verbose' },
    success: function(responseData) {
        targetRoleDefinitionId = responseData.d.Id;
        setPermissionForGroup(groupId, targetRoleDefinitionId)
      //breakRoleInheritanceOfList();
    },
    error: errorHandler
  });
}

// Break role inheritance on the list.
function breakRoleInheritanceOfList() {
  $.ajax({
      url: siteUrl + '/_api/web/lists/getbytitle(\'' + documentLibraryName
        + '\')/breakroleinheritance(true)',
    type: 'POST',
    headers: { 'X-RequestDigest':$('#__REQUESTDIGEST').val() },
    success: deleteCurrentRoleForGroup,
    error: errorHandler
  });
}

// Remove the current role assignment for the group on the list.
function deleteCurrentRoleForGroup() {
  $.ajax({
      url: siteUrl + '/_api/web/lists/getbytitle(\'' + documentLibraryName
        + '\')/roleassignments/getbyprincipalid(' + groupId + ')',
    type: 'POST',
    headers: {
      'X-RequestDigest':$('#__REQUESTDIGEST').val(),
      'X-HTTP-Method':'DELETE'
    },
    success: setNewPermissionsForGroup,
    error: errorHandler
  });
}

// Add the new role assignment for the group on the list.
function setNewPermissionsForGroup() {
  $.ajax({
      url: siteUrl + '/_api/web/lists/getbytitle(\'' + documentLibraryName
        + '\')/roleassignments/addroleassignment(principalid='
        + groupId + ',roledefid=' + targetRoleDefinitionId + ')',
    type: 'POST',
    headers: { 'X-RequestDigest':$('#__REQUESTDIGEST').val() },
    success: successHandler,
    error: errorHandler
  });
}

function setPermissionForGroup(groupId, targetRoleDefinitionId) {
    $.ajax({
        url: siteUrl + '/_api/web/roleassignments/addroleassignment(principalid=' + groupId + ', roledefid=' + targetRoleDefinitionId + ')',
        type: "POST",
        contentType: "application/json;odata=verbose",
        headers: {
            "Accept": "application/json; odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "X-HTTP-Method": "POST"
        },
        success: function (data) {
            // Returning the results
            console.log('Role Assign to ' + targetRoleDefinitionName + ' permission set on group');
        },
        error: errorHandler
    });
}

function  removeAssignedPermissionsFromFolders(relativeURL, _groupId) {
   /* url: '/_api/web/GetFileByServerRelativeUrl('+relativeURL+')/ListItemAllFields/roleassignments/getbyprincipalid('+_groupId+')'
    method: POST      
    Headers: 
    Authorization: "Bearer " + accessToken
    X-RequestDigest: form digest value
    accept: "application/json;odata=verbose"
    content-type: "application/json;odata=verbose"
    'X-HTTP-Method':'DELETE'
    $.ajax({
        url: siteUrl + '/_api/web/lists/getbytitle(\'' + documentLibraryName
          + '\')/roleassignments/addroleassignment(principalid='
          + groupId + ',roledefid=' + targetRoleDefinitionId + ')',
        type: 'POST',
        headers: { 'X-RequestDigest':$('#__REQUESTDIGEST').val() },
        success: successHandler,
        error: errorHandler
    });*/
}

function assignPermissionsToFolder(relativeURL, _groupId, _targetRoleDefinitionId) {
   /*
    url: '/_api/web/GetFileByServerRelativeUrl('+relativeURL+')/ListItemAllFields/roleassignments/addroleassignment(principalid='+_groupId+',roledefid='+_targetRoleDefinitionId+')'
        method: POST      
        Headers: 
        Authorization: "Bearer " + accessToken
       X-RequestDigest: form digest value
        accept: "application/json;odata=verbose"
       content-type: "application/json;odata=verbose"
    
       $.ajax({
           url: '/_api/web/GetFileByServerRelativeUrl('+relativeURL+')/ListItemAllFields/roleassignments/addroleassignment(principalid='+_groupId+',roledefid='+_targetRoleDefinitionId+')'
             + '\')/roleassignments/addroleassignment(principalid='
             + groupId + ',roledefid=' + targetRoleDefinitionId + ')',
           type: 'POST',
           headers: { 'X-RequestDigest':$('#__REQUESTDIGEST').val() },
           success: successHandler,
           error: errorHandler
       });
       */
}


function getUserByEmail(_userEmail) {

    return $.ajax({
        url: siteUrl + "/_api/Web/SiteUsers?$filter=Email eq '" + _userEmail + "'",
        type: 'GET',
        async: false,
        headers: { 'accept': 'application/json;odata=verbose' },
        success: successHandler,
        error: errorHandler
    });

}
function getUserAssignSPGroups(_userID) {

   return $.ajax({
        url: siteUrl + '/_api/web/getuserbyid(\'' + _userID + '\')/groups',
        type: 'GET',
        async: false,
        headers: { 'accept': 'application/json;odata=verbose' },
        success: successHandler,
        error: errorHandler
    });

}
function getGroupMembers(_groupName) {

    return $.ajax({
        url: siteUrl + "/_api/Web/SiteGroups/GetByName('"+_groupName+"')/users",
        type: 'GET',
        async: false,
        headers: { 'accept': 'application/json;odata=verbose' },
        success: successHandler,
        error: errorHandler
    });

}
function removeUserFromAllSPGroups(_userID,_userEmail) {
    getUserAssignSPGroups(_userID).done(function (response) {
        if (response.d.results != null && response.d.results.length > 0) {
            for (var r = 0; r < response.d.results.length; r++) {
                if (response.d.results[r].Title != "DejavuTest Owners") { // Skip Owner group
                    removeUserFromSPGroup(_userEmail, response.d.results[r].Id);
                }
            }
        }
    });

}
function removeUserFromSPGroup(_userEmail, _SPGroupID) {

    $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/sitegroups/GetById(" + _SPGroupID + ")/users/getbyemail('" + _userEmail + "')",
        type: "POST",
        async: false,
        headers: {
            "Accept": "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            // IF-MATCH header: Provides a way to verify that the object being changed has not been changed since it was last retrieved.
            // "IF-MATCH":"*", will overwrite any modification in the object, since it was last retrieved.
            "IF-MATCH": "*",
            //X-HTTP-Method:  The MERGE method updates only the properties of the entity , while the PUT method replaces the existing entity with a new one that you supply in the body of the POST
            "X-HTTP-Method": "DELETE",
            // X-RequestDigest header: When you send a POST request, it must include the form digest value in X-RequestDigest header
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        },
        success: successHandler,
        error: errorHandler
    });

}

/*
function AddUserToSharePointGroup(_userName, vGroupId) {
    if (_userName.length > 0 && vGroupId > 0) {

       return $.ajax({
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/sitegroups(" + vGroupId + ")",
            type: "POST",
            async: false,
            headers: {
                "Accept": "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "__metadata": { "type": "SP.User" },
                "LoginName": _userName,
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            },
            success: successHandler,
            error: errorHandler
        });
    }
}*/


function AddUserToSharePointGroup(_userName, vGroupId) {
    if (_userName.length > 0 && vGroupId > 0) {
       
        var clientContext = new SP.ClientContext.get_current();
        var siteGroups = clientContext.get_web().get_siteGroups();
        var web = clientContext.get_web();
        var spGroup = siteGroups.getById(vGroupId);
        var user = web.ensureUser(_userName);
        var userCollection = spGroup.get_users();
        userCollection.addUser(user);
        clientContext.load(user);
        clientContext.load(spGroup);
        //clientContext.ExecuteQuery(successHandler, errorHandler);
        clientContext.executeQueryAsync(successHandler, errorHandler);
        return true;
    }
}

/*
function setGroupOwnerAsDejavuAdmin(vGroupId) {
    if (vGroupId > 0) {

        var clientContext = new SP.ClientContext.get_current();
        var siteGroups = clientContext.get_web().get_siteGroups();
        var web = clientContext.get_web();
        var spGroup = siteGroups.getById(vGroupId);
        var user = web.ensureUser(_userName);
        var userCollection = spGroup.get_users();
        userCollection.addUser(user);

        clientContext.load(user);
        clientContext.load(spGroup);
        //clientContext.ExecuteQuery(successHandler, errorHandler);
        clientContext.executeQueryAsync(successHandler, errorHandler);
        return true;



        
        var ownerGroup = siteGroups.getByName(vSPGroup_ForAdmin);  
  
        // Load the site group properties    
        clientContext.Load(groupColl);  
  
        // Execute the query to the server.    
        clientContext.ExecuteQuery();  
  
        // Loop through all the site groups  
        foreach (Group group in groupColl)  
        {  
        // Display the group title  
            Console.WriteLine("GroupName: " + group.Title + "-- GroupOwnerTitle: " + group.OwnerTitle);  
  
        // Update the owner  
        group.Owner = ownerGroup;  
        group.Update();  
        clientContext.Load(group);  
  
        // Execute the query to the server.   
        clientContext.ExecuteQuery();  
  
        // Display the updated group owner title  
        Console.WriteLine("UpdatedOwnerTitle: " + group.OwnerTitle);  
    }  



    }
}*/


function successHandler(data) {
    //alert('Request succeeded.');
    console.log('Request succeeded.', data);
}

function errorHandler(xhr, ajaxOptions, thrownError) {
    //console.log('Request failed! SPCustomPermissions.js: ' + xhr + '\n' + thrownError + '\n' + xhr.responseText);
    console.log('Request failed! SPCustomPermissions.js: ', xhr, ajaxOptions, thrownError);
    //alert('Request failed! SPCustomPermissions.js: ' + xhr.status + '\n' + thrownError + '\n' + xhr.responseText);
    var _errorTxt = "Something is wrong with this user.";
    try { _errorTxt = xhr.responseJSON.error.message.value; }
    catch (ex) { console.log(ex); }

    alert('Request failed! \n' + _errorTxt);
}


