function initialize() {
    pop('popDiv');
    hide('popImg');
//    var animate, left = 0, imgObj = null, report = document.getElementById('report'), i = 0;
//    imgObj = document.getElementById('popImg');
//    imgObj.style.position = 'absolute';
//    imgObj.style.top = '50%';
//    imgObj.style.left = '0px';
//    imgObj.style.visibility = 'hidden';
//    moveRight();
    var default_user_html = '<a href="#" id="current" style="text-align:center;"><div style="display:block;float:left;width:auto;height:40px;"><img style="width:35px;height:35px;margin:5px 5px;" src="images/user_circle.png"/></div><div style="display:block;float:left;width:auto;height:40px;">Switch User</div></a><ul id="user_switch"><li><a href="#">Shout User</a></li></ul>';
    function moveRight() {
        left = parseInt(imgObj.style.left, 10);

        if (1000 >= left) {
            imgObj.style.left = (left + 7) + 'px';
            imgObj.style.visibility = 'visible';

            animate = setTimeout(function() {
                moveRight();
            }, 20); // call moveRight in 20msec

            //stopanimate = setTimeout(moveRight,20);
        } else {
            stop();
        }
        //f();
    }

    function stop() {
        clearTimeout(animate);
    }

    var dlat = 12.9667;
    var dlong = 77.5667;
    var list_html = '';
    var ae_list_html = '';
    var shouthtml = '';
    var bounds, ne, sw, lat1, lat2, long1, long2;
    var markers = [];
    var notification_marker = [];
    var data, dataReceived = false;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    function showPosition(position) {
        dlat = position.coords.latitude;
        dlong = position.coords.longitude;
    }
    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
    function rad2deg(rad) {
        return rad * (180 / Math.PI);
    }
    function getDistance(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        if (lat1 > lat2) {
            var temp = lat1;
            lat1 = lat2;
            lat2 = temp;
        }
        if (lon1 > lon2) {
            var temp = lon1;
            lon1 = lon2;
            lon2 = temp;
        }
        var dLat = deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2)
                ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }
//    if (typeof ($.cookie("c_id")) !== "undefined") {
//        var user_html = '<a href="#"><div style="display:block;float:left;width:auto;height:40px;"><img class="uimg" style="width:35px;height:35px;margin:5px 5px;" src="' + $.cookie("c_uimg") + '"/></div><div style="display:block;float:left;width:auto;height:auto;">' + $.cookie("c_uname") + '</div></a><ul id="user_switch"><li><a href="#">Rajnikanth</a></li></ul>';
    var user_html = '<a href="#" id="current" style="text-align:center;"><div style="display:block;float:left;width:auto;height:40px;"><img style="width:35px;height:35px;margin:5px 5px;" src="images/user_circle.png"/></div><div style="display:block;float:left;width:auto;height:40px;">Switch User</div></a><ul id="user_switch"><li><a href="#">Shout User</a></li></ul>';
    $("#user_show").html(user_html);
//    }

    $.post("http://backend.shouuut.com/apis/api/getdummyusers.php", function(data) {
        list_html = '';
        ae_list_html = '';
        $.each(data.users, function(i, item) {
            if (item.userImgFileName !== false && i < 24) {
                list_html += '<li id="user' + item._id.$id + '"><a href="#"><img class="uimg" style="width:25px;height:25px;text-align:center;" src="http://shouuut.com' + item.userImgFileName + '"/>' + item.username + '</a></li>';
                var uId = item._id.$id;
                if (typeof (item.alterEgoName) !== "undefined") {
                    var uAEId = item.alterEgoId.$id;
                    var uAEName = item.alterEgoName;
                    var uAEImg = "http://shouuut.com/user_image/" + uAEId + ".jpg";
                    ae_list_html += '<li id="user' + item.alterEgoId.$id + '"><a href="#"><img class="uimg" style="width:25px;height:25px;text-align:center;" src="http://shouuut.com/user_image/' + item.alterEgoId.$id + '.jpg"/>' + item.alterEgoName + '</a></li>';
                }
                var uAT = item.authToken;
                var uImg = "http://shouuut.com" + item.userImgFileName;
                var uName = item.username.replace(/"/g, "");
                $(document).on("click", "#user" + uId, function() {
                    alert("Welcome " + item.username);
                    $.cookie("c_id", uId, {expires: 7, path: '/'});
                    $.cookie("c_at", uAT, {expires: 7, path: '/'});
                    $.cookie("c_uimg", uImg, {expires: 7, path: '/'});
                    $.cookie("c_uname", uName, {expires: 7, path: '/'});
                    if (typeof (item.alterEgoName) !== "undefined") {
                        $.cookie("c_ae", uAEId, {expires: 7, path: '/'});
                        $.cookie("c_aename", uAEName, {expires: 7, path: '/'});
                        $.cookie("c_aeimg", uAEImg, {espires: 7, path: '/'});
                    }
                    var user_html = '<a href="#"><div style="display:block;float:left;width:auto;height:40px;"><img class="uimg" style="width:35px;height:35px;margin:5px 5px;" src="' + $.cookie("c_uimg") + '"/></div><div style="display:block;float:left;width:auto;height:auto;">' + $.cookie("c_uname") + '</div></a><ul id="user_switch"><li><a href="#">Bruce Wayne</a></li></ul>';
                    var ae_html = '<a href="#"><div style="display:block;float:left;width:auto;height:40px;"><img class="uimg" style="width:35px;height:35px;margin:5px 5px;" src="' + $.cookie("c_aeimg") + '"/></div><div style="display:block;float:left;width:auto;height:auto;">' + $.cookie("c_aename") + '</div></a><ul id="ae_switch"><li><a href="#">Batman</a></li></ul>';
                    $("#user_show").html(user_html);
                    $("#ae_show").html(ae_html);
                    $("#user_switch").html(list_html);
                    $("#ae_switch").html(ae_list_html);
                });
                $(document).on("click", "#user" + uAEId, function() {
                    alert("Welcome " + item.alterEgoName);
                    $.cookie("c_id", uId, {expires: 7, path: '/'});
                    $.cookie("c_at", uAT, {expires: 7, path: '/'});
                    $.cookie("c_uimg", uImg, {expires: 7, path: '/'});
                    $.cookie("c_uname", uName, {expires: 7, path: '/'});
                    if (typeof (item.alterEgoName) !== "undefined") {
                        $.cookie("c_ae", uAEId, {expires: 7, path: '/'});
                        $.cookie("c_aename", uAEName, {expires: 7, path: '/'});
                        $.cookie("c_aeimg", uAEImg, {espires: 7, path: '/'});
                    }
                    var user_html = '<a href="#"><div style="display:block;float:left;width:auto;height:40px;"><img class="uimg" style="width:35px;height:35px;margin:5px 5px;" src="' + $.cookie("c_uimg") + '"/></div><div style="display:block;float:left;width:auto;height:auto;">' + $.cookie("c_uname") + '</div></a><ul id="user_switch"><li><a href="#">Bruce Wayne</a></li></ul>';
                    var ae_html = '<a href="#"><div style="display:block;float:left;width:auto;height:40px;"><img class="uimg" style="width:35px;height:35px;margin:5px 5px;" src="' + $.cookie("c_aeimg") + '"/></div><div style="display:block;float:left;width:auto;height:auto;">' + $.cookie("c_aename") + '</div></a><ul id="ae_switch"><li><a href="#">Batman</a></li></ul>';
                    $("#user_show").html(user_html);
                    $("#ae_show").html(ae_html);
                    $("#user_switch").html(list_html);
                    $("#ae_switch").html(ae_list_html);
                });

            }
        });
        $("#user_switch").html(list_html);
        $("#ae_switch").html(ae_list_html);
    }, "json");

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: new google.maps.LatLng(dlat, dlong),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        panControl: true,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        overviewMapControl: true,
        rotateControl: true
    });

    function getTiming(date)
    {
        var date1 = new Date().getTime();
        date1 = date1 / 1000;
        date = date1 - date; // to get the time since that moment

        var tokens = [31536000, 2592000, 604800, 86400, 3600, 60, 1];
        var timetext = ["year", "month", "week", "day", "hour", "minute", "just now"];
        for (var i = 0; i < tokens.length; i++) {
            if (date < tokens[i])
                continue;
            var numberOfUnits = Math.floor((date / tokens[i]));
            if (i === (tokens.length - 1))
                return timetext[i];
            else
                return Math.round(numberOfUnits) + " " + timetext[i] + ((numberOfUnits > 1) ? "s ago" : " ago");
        }
        return "Just Now";
    }


    var myMarker, myLatLng;
    var infowindow = new google.maps.InfoWindow({
//        disableAutoPan: true
    });
    $(document).bind('keyup', function(key) {
        if (key.keyCode === 27) {
            if (myMarker) {
                myMarker.setMap(null);
                infowindow.close();
            }
            infowindow.close();
            key.preventDefault();
        }
    });

    var marker, i;
    var markd = [];
    // Create the search box and link it to the UI element.
    var input = (document.getElementById('pac-input'));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    var searchBox = new google.maps.places.SearchBox((input));
    // [START region_getplaces]
    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places = searchBox.getPlaces();
        for (var i = 0, marker; marker = markd[i]; i++) {
            marker.setMap(null);
            map.setZoom(8);
        }

        // For each place, get the icon, place name, and location.
        markd = [];
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, place; place = places[i]; i++) {
            var image = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };
            // Create a marker for each place.
            var marker = new google.maps.Marker({
                map: map,
                //icon: "images/favicon.ico",
                title: place.name,
                position: place.geometry.location,
                animation: google.maps.Animation.DROP,
            });
            markd.push(marker);
            bounds.extend(place.geometry.location);
            map.setZoom(8);
        }

        map.fitBounds(bounds);
        map.setZoom(8);
    });
    // [END region_getplaces]

    // Bias the SearchBox results towards places that are within the bounds of the
    // current map's viewport.
    var m = 0;
    
     window.plebeosaur = window.plebeosaur || {
            map: function(evt) {
                myMarker = 0,
                        displayLocation = function(position) {
                            // create a new LatLng object for every position update
                            myLatLng = new google.maps.LatLng(evt.latLng.lat(), evt.latLng.lng());

                            // build entire marker first time thru
                            if (!myMarker) {
                                // define our custom marker image
                                var image = new google.maps.MarkerImage(
                                        'http://plebeosaur.us/etc/map/bluedot_retina.png',
                                        null, // size
                                        null, // origin
                                        new google.maps.Point(8, 8), // anchor (move to center of marker)
                                        new google.maps.Size(17, 17) // scaled size (required for Retina display icon)
                                        );

                                // then create the new marker
                                myMarker = new google.maps.Marker({
                                    flat: true,
                                    icon: image,
                                    map: map,
                                    optimized: false,
                                    position: myLatLng,
                                    title: 'Shout from here',
                                    visible: true
                                });
                                var infowindow = new google.maps.InfoWindow({
                                    content: '<div><div style="display:block;float:left;overflow:visible;"><img class="uimg" style="margin:7px 7px;" src=' + $.cookie("c_uimg") + '></div><div style="display:block;overflow:visible;float:left;"><strong><p style="width:auto;padding-top:10px;text-transform:uppercase;">' + $.cookie("c_uname") + '</p></strong></div><div style="display:block;float:left;clear:left;"><textarea id="shoutTxt" class="commentTxt" cols="50" rows="5" placeholder="Shout your heart out"></textarea></div><div style="float:left;clear:left;display:block;margin-left:40%;"><input  type="button" id="shoutBtn" class="submitbtn" value="Shout"/></div>',
                                });
                                infowindow.open(map, myMarker);
                                // just change marker position on subsequent passes
                            } else {
                                myMarker.setPosition(myLatLng);
                                var infowindow = new google.maps.InfoWindow({
                                    content: '<div><div style="display:block;float:left;overflow:visible;"><img class="uimg" style="margin:7px 7px;" src=' + $.cookie("c_uimg") + '></div><div style="display:block;overflow:visible;float:left;"><strong><p style="width:auto;padding-top:10px;text-transform:uppercase;">' + $.cookie("c_uname") + '</p></strong></div><div style="display:block;float:left;clear:left;"><textarea id="shoutTxt" class="commentTxt" cols="50" rows="5" placeholder="Shout your heart out"></textarea></div><div style="float:left;clear:left;display:block;margin-left:40%;"><input  type="button" id="shoutBtn" class="submitbtn" value="Shout"/></div>',
                                });
                                infowindow.open(map, myMarker);
                            }

                            // center map view on every pass
                            //map.setCenter(myLatLng);
                        },
                        handleError = function(error) {
                            var errorMessage = [
                                'We are not quite sure what happened.',
                                'Sorry. Permission to find your location has been denied.',
                                'Sorry. Your position could not be determined.',
                                'Sorry. Timed out.'
                            ];

                            alert(errorMessage[ error.code ]);
                        },
                        // cache the userAgent
                        useragent = navigator.userAgent;

                // set the map canvas's height/width (Google Maps needs inline height/width)
                //map.style.width = map.style.height = '100%';

                // allow iPhone or Android to track movement
                if (useragent.indexOf('iPhone') !== -1 || useragent.indexOf('Android') !== -1) {
                    navigator.geolocation.watchPosition(
                            displayLocation,
                            handleError,
                            {
                                enableHighAccuracy: true,
                                maximumAge: 30000,
                                timeout: 27000
                            }
                    );

                    // or let other geolocation capable browsers to get their static position
                } else if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(displayLocation, handleError);
                }
            }
        };
        google.maps.event.addListener(map, 'click', function(evt) {
            if (myMarker) {
                myMarker.setMap(null)
            }
            plebeosaur.map(evt);
        });
        function liveShout(event) {
            if (event.handled !== true) {
                var shoutTxt = $("#shoutTxt").val();

                $.post("http://backend.shouuut.com/apis/api/postshout.php", {userId: $.cookie("c_id"), authToken: $.cookie("c_at"), message: shoutTxt, lat: myLatLng.lat(), long: myLatLng.lng()}, function(data) {
                    if (JSON.stringify(data.success) === "true") {
                        alert("Shout Successful!");
                        if (myMarker) {
                            myMarker.setMap(null);
                            infowindow.close();
                        }

                    }
                }, "json");
                event.handled = true;
            }
            return false;
        }
        $(document).on("click", "#shoutBtn", liveShout);
    
    function shoutList(data) {
        shouthtml = '';
        notification_marker = [];
        $.each(data, function(i, item) {
            var sId = item._id.$id;
            marker = new google.maps.Marker({
                record_id: sId,
                position: new google.maps.LatLng(item.postLat, item.postLong),
                icon: "images/favicon.ico",
                map: map
            });
            markers.push(marker);
            notification_marker.push(marker);
            marker.setTitle(JSON.stringify(item.postUserName).replace(/"/g, ""));
            if (typeof (JSON.stringify(item.imgFileName)) !== "undefined") {
                var imgFileName = '<div style="display:block;float:left;clear:left;cursor: pointer;"><img style="border-radius:5px;height:200px;width:200px;" src="http://shouuut.com' + item.imgFileName + '"/> </div>';
            }
            else {
                var imgFileName = '';
            }
            if (typeof (item.echoCount) !== "undefined") {
                var echoCount = '<input type="button" id="echo' + sId + '" class="listAction" value="Echo:' + item.echoCount + '">&nbsp&nbsp&nbsp</input>';
            }
            else {
                var echoCount = '';
            }
            if (typeof (item.shutupCount) !== "undefined") {
                var shutupCount = '<input type="button" id="shutup' + sId + '" class="listAction" value="Shutup:' + item.shutupCount + '">&nbsp&nbsp&nbsp</input>';
            }
            else {
                var shutupCount = '';
            }
            if (typeof (item.commentCount) !== "undefined") {
                var commentCount = '<input type="button" id="comment' + sId + '" class="listAction" value ="Comment:' + item.commentCount + '">&nbsp&nbsp&nbsp</input>';
            }
            else {
                var commentCount = '';
            }
            if (typeof (item.commentCount) !== "undefined") {
                var commentList = '', shoutId = [], commentUserId = [], commentText = [], commentNo = 0;
                $.each(item.action, function(j, item) {
                    if (item.action === 4) {
                        shoutId[commentNo] = sId;
                        commentUserId[commentNo] = JSON.stringify(item.userId.$id);
                        commentText[commentNo] = JSON.stringify(item.msg);
                        commentList += '<div style="display:block;float:left;clear:left;width:auto;"> <img id="cmntDel' + sId + item.userId.$id + '" style="float:right;width:20px;height:20px;cursor:pointer;" src="images/cross.png" /> <p>' + item.userName + '&nbsp:&nbsp&nbsp' + item.msg + '&nbsp&nbsp(&nbsp' + getTiming(item.createdDate.sec) + '&nbsp)</p> </div>';
                        $(document).on("click", "#cmntDel" + sId + item.userId.$id, function() {
                            var cmnt_del = prompt("Delete all of the user's comments?", "yes");
                            if (cmnt_del === "yes") {
                                $.post("http://backend.shouuut.com/apis/api/deletecomment.php", {shoutId: sId, commentUserId: item.userId.$id, commentText: item.msg}, function(data) {
                                    if (JSON.stringify(data.success) === "true") {
                                        alert("Comment Deleted!");
                                    }
                                    else {
                                        alert(JSON.stringify(data.message));
                                    }
                                }, "json");
                            }
                        });
                        commentNo += 1;
                    }
                });
            }
            else {
                var commentList = '';
            }
            if (item.postUserImage[0] === '/') {
                var userImage = "http://shouuut.com" + item.postUserImage;
            }
            else {
                var userImage = item.postUserImage;
            }
            if (item.isAlterEgo === "1") {
                var alterEgo = "  ( Alter-Ego ) ";
            }
            else {
                var alterEgo = '';
            }
            var html = '<div><div style="display:block;float:left;overflow:visible;"><img class="uimg" style="margin:7px 7px;" src="' + userImage + '"/></div><div style="display:block;overflow:visible;float:left;"><strong><p style="width:auto;padding-top:10px;text-transform:uppercase;">' + JSON.stringify(item.postUserName).replace(/"/g, "") + alterEgo + '</p></strong><p style="color:#ccc;margin-left:70px;font-style:italic;">' + getTiming(item.shoutCreatedDate.sec) + ' </p></div><div style="overflow:visible;display:block;float:left;clear:left;text-align:center;padding:15px;"><p>' + JSON.stringify(item.msg).replace(/"/g, "") + '</p>' + imgFileName + '<div style="display:block;float:left;clear:left;overflow:visible;"><br><p style="display:block;float:left;clear:left;">' + echoCount + shutupCount + commentCount + '</p></div><div style="float:left;clear:left;display:block;"><input  type="button" id="ec' + item._id.$id + '" class="submitbtn" value="Echo"/><input type="button" id="su' + item._id.$id + '" class="submitbtn" value="Shutup"/><input type="button" id="cmnt' + item._id.$id + '" class="submitbtn" value="Comment"/><input type="button" id="del' + item._id.$id + '"class="submitbtn" value="Delete"/></div><div style="display:block;float:left;clear:left;"><br><textarea id="cmntTxt' + item._id.$id + '" class="commentTxt" cols="50" rows="5" placeholder="Comment here"></textarea></div>' + commentList + '</div>';
            shouthtml += '<div id="' + item._id.$id + '" style="display:block;float:left;clear:left;overflow:visible;cursor:pointer;"><div style="display:block;float:left;"><img class="uimg" style="margin:5px 5px;" src="' + userImage + '"/></div><div style="display:block;float:left;"><strong><p style="padding-top:7px;text-transform:uppercase;">' + JSON.stringify(item.postUserName).replace(/"/g, "") + alterEgo + '</p></strong><p style="color:#ccc;margin-left:70px;font-style:italic;">' + getTiming(item.shoutCreatedDate.sec) + '</p></div><div style="display:block;float:left;clear:left;text-align:center;padding:15px;"><p>' + JSON.stringify(item.msg).replace(/"/g, "") + '</p></div>' + imgFileName + '<br></div>';
            $(document).on("click", "#" + item._id.$id, function() {
                hide('echoDiv');
                hide('shutupDiv');
                if (myMarker) {
                    myMarker.setMap(null);
                    infowindow.close();
                }
                $.each(markers, function(j, itm) {
                    if (markers[j].record_id === item._id.$id) {
//                                        map.setZoom(7);
//                                        map.setCenter(markers[i].getPosition());
                        google.maps.event.trigger(markers[j], 'click');
                    }
                });
            });

            $(document).on("click", "#echo" + sId, function() {
                pop('echoDiv');
                var echohtml = '';
                $("#echo_list").html('<img id="echo_load" style="text-align:center;vertical-align: middle;" src="images/loading.gif"/><br><p style="text-align:center;font-size:1.5em;">Loading Users Echoed..</p>');
                $.post("http://backend.shouuut.com/apis/api/fetchshoutechouser.php", {userId: $.cookie("c_id"), authToken: $.cookie("c_at"), shoutId: sId, echoShutup: 1, offset: 0, limit: 20}, function(data) {
                    if (JSON.stringify(data.success) === "true") {
                        $.each(data.result.action, function(i, item) {
                            echohtml += '<div style="display:block;float:left;clear:left;"><p style="text-transform:uppercase;"><strong>' + item.userName + '</strong>&nbsp;&nbsp;&nbsp;&nbsp;<i>' + getTiming(item.createdDate.sec) + '</i></p></div>';
                        });
                        $("#echo_list").html(echohtml);
                    }
                    else {
                        alert(JSON.stringify(data.message));
                    }
                }, "json");
            });
            $(document).on("click", "#shutup" + sId, function() {
                pop('shutupDiv');
                var shutuphtml = '';
                $("#shutup_list").html('<img id="shutup_load" style="text-align:center;vertical-align: middle;" src="images/loading.gif"/><br><p style="text-align:center;font-size:1.5em;">Loading Users Shutuped..</p>');
                $.post("http://backend.shouuut.com/apis/api/fetchshoutechouser.php", {userId: $.cookie("c_id"), authToken: $.cookie("c_at"), shoutId: sId, echoShutup: 2, offset: 0, limit: 20}, function(data) {
                    if (JSON.stringify(data.success) === "true") {
                        $.each(data.result.action, function(i, item) {
                            shutuphtml += '<div style="display:block;float:left;clear:left;"><p style="text-transform:uppercase;"><strong>' + item.userName + '</strong>&nbsp;&nbsp;&nbsp;&nbsp;<i>' + getTiming(item.createdDate.sec) + '</i></p></div>';
                        });
                        $("#shutup_list").html(shutuphtml);
                    }
                    else {
                        alert(JSON.stringify(data.message));
                    }
                }, "json");

            });
            $(document).on("click", ".closeDiv", function() {
                hide('echoDiv');
                hide('shutupDiv');
            });

            function liveDelete(event) {
                if (event.handled !== true) {
                    var del_response = prompt("Remove this permanently?", "yes");
                    if (del_response === "yes") {
                        $.post("http://backend.shouuut.com/apis/api/deleteshout.php", {shoutId: sId}, function(data) {
                            if (JSON.stringify(data.success) === "true")
                            {
                                alert("Shout Deleted!");
                                infowindow.close();
                                //google.maps.event.trigger(map, 'resize');
                            }
                            else {
                                alert(data.message);
                            }
                        }, "json");
                    }
                    event.handled = true;
                }
                return false;
            }
            $(document).on("click", "#del" + sId, liveDelete);

            function liveEcho(event) {
                if (event.handled !== true) {
                    var lat = deg2rad(item.postLat);
                    var long = deg2rad(item.postLong);
                    var distance = Math.floor((Math.random() * 2) + 1);
                    var dr = distance / 6384;
                    var lat1 = rad2deg(Math.asin(Math.sin(lat) * Math.cos(dr) + Math.cos(deg2rad(lat)) * Math.sin(dr) * Math.cos(deg2rad(225))));
                    var latrad = deg2rad(lat1);
                    var long1 = rad2deg(long + Math.atan2(Math.sin(deg2rad(225)) * Math.sin(dr) * Math.cos(lat), Math.cos(dr) - Math.sin(latrad) * Math.sin(lat1)));

                    if (item.isAlterEgo !== "1") {
                        $.post("http://backend.shouuut.com/apis/api/postechoshutup.php", {userId: $.cookie("c_id"), authToken: $.cookie("c_at"), shoutId: sId, echoShutup: 1, lat: lat1, long: long1}, function(data) {
                            if (JSON.stringify(data.success) === "true") {
                                alert("Echo Success!");
                                infowindow.close();
                            }
                            else {
                                alert(data.message);
                            }
                        }, "json");
                    }
                    else {
                        $.post("http://backend.shouuut.com/apis/api/postechoshutup.php", {userId: $.cookie("c_ae"), authToken: $.cookie("c_at"), shoutId: sId, echoShutup: 1, lat: lat1, long: long1}, function(data) {
                            if (JSON.stringify(data.success) === "true") {
                                alert("Echo Success!");
                                infowindow.close();
                            }
                            else {
                                alert(data.message);
                            }
                        }, "json");
                    }
                    event.handled = true;
                }
                return false;
            }
            $(document).on("click", "#ec" + sId, liveEcho);

            function liveShutup(event)
            {
                if (event.handled !== true) {
                    var lat = deg2rad(item.postLat);
                    var long = deg2rad(item.postLong);
                    var distance = Math.floor((Math.random() * 2) + 1);
                    var dr = distance / 6384;
                    var lat1 = rad2deg(Math.asin(Math.sin(lat) * Math.cos(dr) + Math.cos(deg2rad(lat)) * Math.sin(dr) * Math.cos(deg2rad(225))));
                    var latrad = deg2rad(lat1);
                    var long1 = rad2deg(long + Math.atan2(Math.sin(deg2rad(225)) * Math.sin(dr) * Math.cos(lat), Math.cos(dr) - Math.sin(latrad) * Math.sin(lat1)));
                    if (item.isAlterEgo !== "1") {
                        $.post("http://backend.shouuut.com/apis/api/postechoshutup.php", {userId: $.cookie("c_id"), authToken: $.cookie("c_at"), shoutId: sId, echoShutup: 2, lat: lat1, long: long1}, function(data) {
                            if (JSON.stringify(data.success) === "true") {
                                alert("Shutup Success!");
                                infowindow.close();
                            }
                            else {
                                alert(data.message);
                            }
                        }, "json");
                    }
                    else {
                        $.post("http://backend.shouuut.com/apis/api/postechoshutup.php", {userId: $.cookie("c_ae"), authToken: $.cookie("c_at"), shoutId: sId, echoShutup: 1, lat: lat1, long: long1}, function(data) {
                            if (JSON.stringify(data.success) === "true") {
                                alert("Echo Success!");
                                infowindow.close();
                            }
                            else {
                                alert(data.message);
                            }
                        }, "json");
                    }
                    event.handled = true;
                }
                return false;
            }
            $(document).on("click", "#su" + sId, liveShutup);

            function liveComment(event)
            {
                if (event.handled !== true)
                {
                    var lat = deg2rad(item.postLat);
                    var long = deg2rad(item.postLong);
                    var distance = Math.floor((Math.random() * 2) + 1);
                    var dr = distance / 6384;
                    var lat1 = rad2deg(Math.asin(Math.sin(lat) * Math.cos(dr) + Math.cos(deg2rad(lat)) * Math.sin(dr) * Math.cos(deg2rad(225))));
                    var latrad = deg2rad(lat1);
                    var long1 = rad2deg(long + Math.atan2(Math.sin(deg2rad(225)) * Math.sin(dr) * Math.cos(lat), Math.cos(dr) - Math.sin(latrad) * Math.sin(lat1)));

                    var cmntTxt = $("#cmntTxt" + sId).val();

                    if (item.isAlterEgo !== "1") {

                        $.post("http://backend.shouuut.com/apis/api/postshoutcomment.php", {userId: $.cookie("c_id"), authToken: $.cookie("c_at"), shoutId: sId, comment: cmntTxt, lat: lat1, long: long1}, function(data) {
                            if (JSON.stringify(data.success) === "true") {
                                alert("Comment Success!");
                                infowindow.close();
                            }
                            else {
                                alert(data.message);
                            }

                        }, "json");
                    }
                    else {
                        $.post("http://backend.shouuut.com/apis/api/postshoutcomment.php", {userId: $.cookie("c_ae"), authToken: $.cookie("c_at"), shoutId: sId, comment: cmntTxt, lat: lat1, long: long1}, function(data) {
                            if (JSON.stringify(data.success) === "true") {
                                alert("Comment Success!");
                                infowindow.close();
                            }
                            else {
                                alert(data.message);
                            }

                        }, "json");
                    }
                    event.handled = true;
                }
                return false;
            }
            $(document).on("click", "#cmnt" + sId, liveComment);

            google.maps.event.addListener(marker, 'click', (function(marker, m) {
                return function() {
                    if (myMarker) {
                        myMarker.setMap(null);
                        infowindow.close();
                    }
                    infowindow.setContent(html);
                    infowindow.open(map, markers[m]);
                };
            })(marker, m));
            m++;
        });
    }
    var lat1 = -85;
    var lat2 = +85;
    var long1 = -180;
    var long2 = 180;
    var offset = 0, limit = 15;
    var track_load = 0; //total loaded record group(s)
    var loading = false; //to prevents multipal ajax loads
    var end = false; //total record group(s)

    $.post("http://backend.shouuut.com/apis/api/fetchshouts.php", {lat1: lat1, long1: long1, lat2: lat2, long2: long2, offset: offset, limit: limit}, function(data) {
        shoutList(data.Shout);
        $('#list').html(shouthtml);
        offset += 15; //load first group
        hide('popImg');
        hide('popDiv');
    });

    $(".animation_image").on("click", function(e) { //detect page scroll
        if (end === false && loading === false) //there's more data to load
        {
            loading = true; //prevent further ajax loading
            //load data from the server using a HTTP POST request
            $.post("http://backend.shouuut.com/apis/api/fetchshouts.php", {lat1: lat1, long1: long1, lat2: lat2, long2: long2, offset: offset, limit: limit}, function(data) {

                if (typeof (data.Shout[1]._id.$id) === "undefined") {
                    end = true;
                }
                shoutList(data.Shout);
                $("#list").append(shouthtml); //append received data into the element
                offset += 15;
                loading = false;
            });
        }
    });

    function fetchFlags(event) {
        if (event.handled !== true) {
            var flaghtml = '<img id="flag_load" style="text-align:center;vertical-align: middle;width:50px;height:50px;cursor:pointer;" src="images/refresh.png"/><br><p style="text-align:center;font-size:1.5em;">Click to Load Flagged Shouts..</p>';
            $("#flag_list").html(flaghtml);
            var flaghtml = '';
            $.post("http://backend.shouuut.com/apis/api/fetchreportedshout.php", function(json) {
                $.each(json.Shout, function(i, item) {
                    if (typeof (JSON.stringify(item.imgFileName)) !== "undefined") {
                        var imgFileName = '<div style="display:block;float:left;clear:left;"><img style="border-radius:5px;height:200px;width:200px;" src="http://shouuut.com' + item.imgFileName + '"/> </div>';
                    }
                    else {
                        var imgFileName = '';
                    }
                    if (item.postUserImage[0] === '/') {
                        var userImage = "http://shouuut.com" + item.postUserImage;
                    }
                    else {
                        var userImage = item.postUserImage;
                    }
                    if (item.isAlterEgo === "1") {
                        var alterEgo = "( Alter Ego )";
                    }
                    else {
                        var alterEgo = '';
                    }
                    flaghtml += '<div id="flag' + item._id.$id + '" style="display:block;float:left;clear:left;overflow:visible;"><div style="display:block;float:left;"><img class="uimg" style="margin:5px 5px;" src="' + userImage + '"/></div><div style="display:block;float:left;"><strong><p style="padding-top:7px;text-transform:uppercase;">' + JSON.stringify(item.postUserName).replace(/"/g, "") + alterEgo + '</p></strong><p style="color:#ccc;margin-left:50px;font-style:italic;">' + getTiming(item.shoutCreatedDate.sec) + '&nbsp&nbsp<img id="notspam' + item._id.$id + '" style="width:30px;height;30px;cursor:pointer;" src="images/tick.png"/>&nbsp&nbsp<img id="spam' + item._id.$id + '" style="width:30px;height;30px;cursor:pointer;" src="images/cross.png" /></p></div><div style="display:block;float:left;clear:left;text-align:center;padding:15px;"><p>' + JSON.stringify(item.msg).replace(/"/g, "") + '</p></div>' + imgFileName + '<br></div>';
                    $(document).on("click", "#spam" + item._id.$id, function() {
                        var del_response = prompt("Remove this permanently?", "yes");
                        if (del_response === "yes") {
                            $.post("http://backend.shouuut.com/apis/api/deleteshout.php", {shoutId: item._id.$id}, function(data) {
                                if (JSON.stringify(data.success) === "true")
                                {
                                    alert("Spam Shout Deleted!");
                                }
                            }, "json");
                        }
                    });

                    $(document).on("click", "#notspam" + item._id.$id, function() {
                        $.post("http://backend.shouuut.com/apis/api/spamverify.php", {shoutId: item._id.$id}, function(data) {
                            if (JSON.stringify(data.success) === "true") {
                                if (typeof (JSON.stringify(data.message)) !== "undefined") {
                                    alert(data.message);
                                }
                                else {
                                    alert("Unmarked Spam!");
                                }
                            }
                        }, "json");
                    });
                });
                $("#flag_list").html(flaghtml);
            });
            event.handled = true;
        }
        return false;
    }

    $("#flag_load").on("click", fetchFlags);
    $("#flag").click(function() {
        hide('notificationDiv');
        pop('popDiv');
        pop('flagDiv');
    });
    function pop(div) {
        document.getElementById(div).style.display = 'block';
    }
    function hide(div) {
        document.getElementById(div).style.display = 'none';
    }
    //To detect escape button
    document.onkeydown = function(evt) {
        evt = evt || window.event;
        if (evt.keyCode == 27) {
            hide('popImg');
            hide('popDiv');
            hide('flagDiv');
            hide('notificationDiv');
            hide('echoDiv');
            hide('shutupDiv');
        }
    };
    function fetchNotification(data) {
        $.post("http://backend.shouuut.com/apis/api/fetchshout.php", {shoutId: data._id.$id}, function(item) {
            shoutList(item.Shout);
            google.maps.event.trigger(notification_marker[0], 'click');
        });
    }
    $("#notification").click(function() {
        var notificationhtml = '';
        pop('popDiv');
        pop('notificationDiv');
        $.post("http://backend.shouuut.com/apis/api/fetchnotification.php", {userId: $.cookie("c_id"), authToken: $.cookie("c_at"), offset: 0, limit: 20}, function(data) {
            $.each(data.result, function(i, item) {
                notificationhtml += '<div id="notification' + item._id.$id + '"style="display:block;float:left;clear:left;overflow:visible;cursor:pointer;"><div style="display:block;float:left;"><img class="uimg" style="margin:5px 5px;" src="' + item.shout.postUserImage + '"/></div><div style="display:block;float:left;"><strong><p style="padding-top:7px;text-transform:uppercase;">' + item.shout.postUserName + '</p></strong><p style="color:#ccc;margin-left:50px;font-style:italic;">' + getTiming(item.notificationCreatedTime.sec) + '</p></div><div style="display:block;float:left;clear:left;text-align:center;padding:15px;"><p>' + item.msgTemplate + '</p></div><br></div>';
                $(document).on("click", "#notification" + item._id.$id, function() {
                    fetchNotification(item.shout);
                    hide('popDiv');
                });
            });
            $("#notification_list").html(notificationhtml);
        });
    });
    $("#relogin").on("click", function() {
        var prompt_response = prompt("Re-login users ?", "yes");
        if (prompt_response === "yes") {
            pop('popDiv');
            pop('popImg');
            var completed = false;
            var success = 0, fail = 0;
            var emails = ["dummyuser01@mail.com", "dummyuser02@mail.com", "dummyuser03@mail.com", "dummyuser04@mail.com", "dummyuser05@mail.com", "dummyuser06@mail.com", "dummyuser07@mail.com", "dummyuser08@mail.com", "dummyuser09@mail.com", "dummyuser10@mail.com", "dummyuser11@mail.com", "dummyuser12@mail.com", "dummyuser13@mail.com", "dummyuser14@mail.com", "dummyuser15@mail.com", "dummyuser16@mail.com", "dummyuser17@mail.com", "dummyuser18@mail.com", "dummyuser19@mail.com", "dummyuser20@mail.com"];
            for (var i = 0; i < 20; i++) {
                $.post("http://backend.shouuut.com/apis/api/login.php", {email: emails[i], password: "password"}, function(json) {
                    if (JSON.stringify(json.success) === "true") {
                        success++;
                    }
                    else {
                        fail++;
                    }
                    if (i === 19) {
                        completed = true;
                    }
                }, "json");
            }
            setTimeout(function() {
                alert("Successful Re-Logins:" + success + " Failed:" + fail);
                hide('popImg');
                hide('popDiv');
                userReload();
            }, 15000);
        }
    });
    function userReload() {
        list_html = '';
        $("#user_show").html(default_user_html);
        $.post("http://backend.shouuut.com/apis/api/getdummyusers.php", function(data) {
            $.each(data.users, function(i, item) {
                if (item.userImgFileName !== false) {
                    list_html += '<li id="user' + item._id.$id + '"><a href="#"><img class="uimg" style="width:25px;height:25px;text-align:center;" src="http://shouuut.com' + item.userImgFileName + '"/>' + item.username + '</a></li>';
                }
            });
            $("#user_switch").html(list_html);
        }, "json");
    }


    $(document).on("click", "#blore", function() {
        dlat=12.9667;
        dlong=77.5667;
        map.setCenter(new google.maps.LatLng(dlat, dlong));
        map.setZoom(10);
        var opt = {minZoom: 9, maxZoom: 15};
        map.setOptions(opt);
        google.maps.event.addListener(map, 'idle', function() {
            if (getDistance(dlat, dlong, map.getCenter().lat(), map.getCenter().lng()) > 50) {
                map.setCenter(new google.maps.LatLng(dlat, dlong));
            }
        });

        var user_html = '<a href="#" id="current" style="text-align:center;"><div style="display:block;float:left;width:auto;height:40px;"><img style="width:35px;height:35px;margin:5px 5px;" src="images/user_circle.png"/></div><div style="display:block;float:left;width:auto;height:40px;">Switch User</div></a><ul id="user_switch"><li><a href="#">Shout User</a></li></ul>';
        $("#user_show").html(user_html);
        $.post("http://backend.shouuut.com/apis/api/getdummyusers.php", function(data) {
            list_html = '';
            $.each(data.users, function(i, item) {
                if (item.userImgFileName !== false && (i > 23 && i < 55) || (i > 94 && i < 114 )) {
                    list_html += '<li id="user' + item._id.$id + '"><a href="#"><img class="uimg" style="width:25px;height:25px;text-align:center;" src="http://shouuut.com' + item.userImgFileName + '"/>' + item.username + '</a></li>';
                    var uId = item._id.$id;
                    var uAT = item.authToken;
                    var uImg = "http://shouuut.com" + item.userImgFileName;
                    var uName = item.username.replace(/"/g, "");
                    $(document).on("click", "#user" + uId, function() {
                        alert("Welcome " + item.username);
                        $.cookie("c_id", uId, {expires: 7, path: '/'});
                        $.cookie("c_at", uAT, {expires: 7, path: '/'});
                        $.cookie("c_uimg", uImg, {expires: 7, path: '/'});
                        $.cookie("c_uname", uName, {expires: 7, path: '/'});
                        var user_html = '<a href="#"><div style="display:block;float:left;width:auto;height:40px;"><img class="uimg" style="width:35px;height:35px;margin:5px 5px;" src="' + $.cookie("c_uimg") + '"/></div><div style="display:block;float:left;width:auto;height:auto;">' + $.cookie("c_uname") + '</div></a><ul id="user_switch"><li><a href="#">Rajnikanth</a></li></ul>';
                        $("#user_show").html(user_html);
                        $("#user_switch").html(list_html);
                    });
                }
            });
            $("#user_switch").html(list_html);
        }, "json");
    });
    
    $(document).on("click", "#mumbai", function() {
        dlat=18.9750;
        dlong=72.8258;
        map.setCenter(new google.maps.LatLng(dlat, dlong));
        map.setZoom(10);
        var opt = {minZoom: 9, maxZoom: 15};
        map.setOptions(opt);
        google.maps.event.addListener(map, 'idle', function() {
            if (getDistance(dlat, dlong, map.getCenter().lat(), map.getCenter().lng()) > 50) {
                map.setCenter(new google.maps.LatLng(dlat, dlong));
            }
        });

        var user_html = '<a href="#" id="current" style="text-align:center;"><div style="display:block;float:left;width:auto;height:40px;"><img style="width:35px;height:35px;margin:5px 5px;" src="images/user_circle.png"/></div><div style="display:block;float:left;width:auto;height:40px;">Switch User</div></a><ul id="user_switch"><li><a href="#">Shout User</a></li></ul>';
        $("#user_show").html(user_html);
        $.post("http://backend.shouuut.com/apis/api/getdummyusers.php", function(data) {
            list_html = '';
            $.each(data.users, function(i, item) {
                if (item.userImgFileName !== false && i > 54 && i < 95) {
                    list_html += '<li id="user' + item._id.$id + '"><a href="#"><img class="uimg" style="width:25px;height:25px;text-align:center;" src="http://shouuut.com' + item.userImgFileName + '"/>' + item.username + '</a></li>';
                    var uId = item._id.$id;
                    var uAT = item.authToken;
                    var uImg = "http://shouuut.com" + item.userImgFileName;
                    var uName = item.username.replace(/"/g, "");
                    $(document).on("click", "#user" + uId, function() {
                        alert("Welcome " + item.username);
                        $.cookie("c_id", uId, {expires: 7, path: '/'});
                        $.cookie("c_at", uAT, {expires: 7, path: '/'});
                        $.cookie("c_uimg", uImg, {expires: 7, path: '/'});
                        $.cookie("c_uname", uName, {expires: 7, path: '/'});
                        var user_html = '<a href="#"><div style="display:block;float:left;width:auto;height:40px;"><img class="uimg" style="width:35px;height:35px;margin:5px 5px;" src="' + $.cookie("c_uimg") + '"/></div><div style="display:block;float:left;width:auto;height:auto;">' + $.cookie("c_uname") + '</div></a><ul id="user_switch"><li><a href="#">Rajnikanth</a></li></ul>';
                        $("#user_show").html(user_html);
                        $("#user_switch").html(list_html);
                    });
                }
            });
            $("#user_switch").html(list_html);
        }, "json");
       
    });

    $(document).on("click", "#chennai", function() {
        dlat=13.0839;
        dlong=80.2700;
        map.setCenter(new google.maps.LatLng(dlat, dlong));
        map.setZoom(10);
        var opt = {minZoom: 9, maxZoom: 15};
        map.setOptions(opt);
        google.maps.event.addListener(map, 'idle', function() {
            if (getDistance(dlat, dlong, map.getCenter().lat(), map.getCenter().lng()) > 50) {
                map.setCenter(new google.maps.LatLng(dlat, dlong));
            }
        });

        var user_html = '<a href="#" id="current" style="text-align:center;"><div style="display:block;float:left;width:auto;height:40px;"><img style="width:35px;height:35px;margin:5px 5px;" src="images/user_circle.png"/></div><div style="display:block;float:left;width:auto;height:40px;">Switch User</div></a><ul id="user_switch"><li><a href="#">Shout User</a></li></ul>';
        $("#user_show").html(user_html);
        $.post("http://backend.shouuut.com/apis/api/getdummyusers.php", function(data) {
            list_html = '';
            $.each(data.users, function(i, item) {
                if (item.userImgFileName !== false && i > 113 && i < 154) {
                    list_html += '<li id="user' + item._id.$id + '"><a href="#"><img class="uimg" style="width:25px;height:25px;text-align:center;" src="http://shouuut.com' + item.userImgFileName + '"/>' + item.username + '</a></li>';
                    var uId = item._id.$id;
                    var uAT = item.authToken;
                    var uImg = "http://shouuut.com" + item.userImgFileName;
                    var uName = item.username.replace(/"/g, "");
                    $(document).on("click", "#user" + uId, function() {
                        alert("Welcome " + item.username);
                        $.cookie("c_id", uId, {expires: 7, path: '/'});
                        $.cookie("c_at", uAT, {expires: 7, path: '/'});
                        $.cookie("c_uimg", uImg, {expires: 7, path: '/'});
                        $.cookie("c_uname", uName, {expires: 7, path: '/'});
                        var user_html = '<a href="#"><div style="display:block;float:left;width:auto;height:40px;"><img class="uimg" style="width:35px;height:35px;margin:5px 5px;" src="' + $.cookie("c_uimg") + '"/></div><div style="display:block;float:left;width:auto;height:auto;">' + $.cookie("c_uname") + '</div></a><ul id="user_switch"><li><a href="#">Rajnikanth</a></li></ul>';
                        $("#user_show").html(user_html);
                        $("#user_switch").html(list_html);
                    });
                }
            });
            $("#user_switch").html(list_html);
        }, "json");
       
    });

    $(document).on("click", "#delhi", function() {
        dlat=28.6100;
        dlong=77.2300;
        map.setCenter(new google.maps.LatLng(dlat, dlong));
        map.setZoom(10);
        var opt = {minZoom: 9, maxZoom: 15};
        map.setOptions(opt);
        google.maps.event.addListener(map, 'idle', function() {
            if (getDistance(dlat, dlong, map.getCenter().lat(), map.getCenter().lng()) > 50) {
                map.setCenter(new google.maps.LatLng(dlat, dlong));
            }
        });

        var user_html = '<a href="#" id="current" style="text-align:center;"><div style="display:block;float:left;width:auto;height:40px;"><img style="width:35px;height:35px;margin:5px 5px;" src="images/user_circle.png"/></div><div style="display:block;float:left;width:auto;height:40px;">Switch User</div></a><ul id="user_switch"><li><a href="#">Shout User</a></li></ul>';
        $("#user_show").html(user_html);
        $.post("http://backend.shouuut.com/apis/api/getdummyusers.php", function(data) {
            list_html = '';
            $.each(data.users, function(i, item) {
                if (item.userImgFileName !== false && i > 153 && i < 194) {
                    list_html += '<li id="user' + item._id.$id + '"><a href="#"><img class="uimg" style="width:25px;height:25px;text-align:center;" src="http://shouuut.com' + item.userImgFileName + '"/>' + item.username + '</a></li>';
                    var uId = item._id.$id;
                    var uAT = item.authToken;
                    var uImg = "http://shouuut.com" + item.userImgFileName;
                    var uName = item.username.replace(/"/g, "");
                    $(document).on("click", "#user" + uId, function() {
                        alert("Welcome " + item.username);
                        $.cookie("c_id", uId, {expires: 7, path: '/'});
                        $.cookie("c_at", uAT, {expires: 7, path: '/'});
                        $.cookie("c_uimg", uImg, {expires: 7, path: '/'});
                        $.cookie("c_uname", uName, {expires: 7, path: '/'});
                        var user_html = '<a href="#"><div style="display:block;float:left;width:auto;height:40px;"><img class="uimg" style="width:35px;height:35px;margin:5px 5px;" src="' + $.cookie("c_uimg") + '"/></div><div style="display:block;float:left;width:auto;height:auto;">' + $.cookie("c_uname") + '</div></a><ul id="user_switch"><li><a href="#">Rajnikanth</a></li></ul>';
                        $("#user_show").html(user_html);
                        $("#user_switch").html(list_html);
                    });
                }
            });
            $("#user_switch").html(list_html);
        }, "json");
       
    });

    $(document).on("click", "#wws", function() {
        window.location.href = "http://backend.shouuut.com/lite";
    });

}