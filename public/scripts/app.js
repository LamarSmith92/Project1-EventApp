console.log('app.js is loaded!');
var myTags = [];

var availableTags = [
  "ActionScript", "AppleScript", "Asp", "BASIC", "C", "C++", "Clojure", "COBOL", "ColdFusion", "Erlang", "Fortran",
  "Groovy", "Haskell", "Java", "JavaScript", "Lisp", "Perl", "PHP", "Picnic", "Beer", "Party", "Lecture", "Education",
  "Meetup", "Formal", "MEAN","React","JS", "Full stack", "Interview","Algorithms","Front-end","Back-end", "Database",
  "Web design","Graphic design","Design","LinkedIn","Resume","Computer science","Ruby", "Open bar", "La Croix","Rails",
  "MongoDB","Networking","Mongoose","Job fair","Coding","General Assembly","Whiteboard","Hangout","Social","Brand","WDI 36",
  "Web development","C+","Handlebars","SASS","Beginners","Intermediate","Advanced","Python","Ruby","Scala","Scheme",
  "Hack Reactor", "ES6","Node.js", "Express", "Knitting", "Skydiving", "dogs", "cats", "Other", "Veterans", "Github",
  "Hackathon", "Dating", "iOS Development", "UX", "UI", "Photoshop", "Adobe", "SQL"
];

$(document).ready(function() {
  console.log('dom is loaded!');

    $.ajax({
        method: 'GET',
        url: '/api/events',
        success: renderMultipleEvents,
        error: handleError
    }); //closes ajax get request

    // Google Maps Start
      // initMap();
      // end of google maps

    $('#createEvent').on('click', handleNewEventSubmit);

    $('#eventSearchButton').on('click', handleSearchSubmit);

    $('#datepicker').datepicker({
      format: "mm/dd/yyyy",
      multidate: false
    });

    $( function autoSearch() {
       $("#tags").autocomplete({
         minLength: 1,
         source: availableTags,
         select: function(event, ui) {
           var selection = ui.item.value;
            $('#tagsHere').append(selection + " ");
            myTags.push(selection);
            $(this).val(''); return false;
          }//closes select function
       });//closes autocomplete function
    }); //closes search function

    $("#eventSearchForm").autocomplete({
      minLength: 1,
      source: availableTags,
      select: function(event, ui) {
        var selection = ui.item.value;
        console.log(selection);
        //  myTags.push(selection);
        //  $(this).val(''); return false;
       }//closes select function
    });//closes autocomplete function



}); //closes DOM ready function

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: -33.8688,
      lng: 151.2195
    },
    zoom: 13
  });
  var input = /** @type {!HTMLInputElement} */ (
    document.getElementById('pac-input'));
    var types = document.getElementById('type-selector');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);
    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29)
    });
    autocomplete.addListener('place_changed', function() {
      infowindow.close();
      marker.setVisible(false);
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        window.alert("Autocomplete's returned place contains no geometry");
        return;
      }
      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17); // Why 17? Because it looks good.
      }
      marker.setIcon( /** @type {google.maps.Icon} */ ({
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(35, 35)
      }));
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);
      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }
      infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
      infowindow.open(map, marker);
    });
    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    function setupClickListener(id, types) {
      var radioButton = document.getElementById(id);
      radioButton.addEventListener('click', function() {
        autocomplete.setTypes(types);
      });
    }
    setupClickListener('changetype-all', []);
    setupClickListener('changetype-address', ['address']);
    setupClickListener('changetype-establishment', ['establishment']);
    setupClickListener('changetype-geocode', ['geocode']);
  }

function renderMultipleEvents(events) {
  events.forEach(function(event) {
    renderEvent(event);
  }); //closes foreach
}//closes rendermult.

function renderEvent(event) {
  var keyWordArray = event.keywords;
  keyWordArray = keyWordArray.map( function ripActualKeywordsOut(keyWord){
    return keyWord.name;
  });
  event.keywords = keyWordArray.join(', ');
  var eventHtml = (`
        <div class="panel panel-default">
          <div class="panel-body">
          <!-- begin event internal row -->
            <div class='row'>
              <div class="col-lg- col-md-3 col-xs-12 thumbnail event-art">
                <img src="${event.imageUrl}" class="responsive-img myImage" alt="event image">
               </div>
              <div class="col-md-9 col-xs-12">
                <ul>
                  <li>
                    <h4 class='inline-header'>${event.eventName}</h4>
                  </li>
                  <li>
                    <span class='eventLocation'>${event.location}</span>
                    <span class='eventTime pull-right'>&#160;${event.time}</span>
                    <span class='eventDate pull-right'>${event.date}</span>
                  </li>
                  <li>
                    <span class='eventDescription'>${event.description}</span>
                  </li>
                </ul>
                <div class="col-xs-6">
                  <span class='event-date'>${event.peopleInterested} people interested</span>
                </div>
                <div class="col-xs-6">
                  <button type="button" class="btn btn-xs btn-info pull-right" id="moreEventInfo" data-toggle="modal" data-target="#moreEventInfoModal">
                    Learn more
                  </button>
                  <!-- Modal -->
                  <div class="modal fade" id="moreEventInfoModal" tabindex="-1" role="dialog" aria-labelledby="moreEventInfoModalLabel">
                    <div class="modal-dialog" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        </div>
                        <div class="modal-body">
                          <form class="form-horizontal">

                          <div class="row event">
                            <div class="col-md-10 col-md-offset-1">
                              <div class="panel panel-default">
                                <div class="panel-body">
                                <!-- begin event internal row -->
                                  <div class='row'>
                                    <div class="col-lg- col-md-3 col-xs-12 thumbnail event-art">
                                      <img src="http://wp.streetwise.co/wp-content/blogs.dir/2/files/2015/12/Ladies_Learning_Code_event_November_26_2011-630x420.jpg" class="responsive-img" alt="event image">
                                    </div>
                                    <div class="col-md-9 col-xs-12">
                                      <ul class="list-group">
                                        <li class="list-group-item">
                                          <h4 class='inline-header'>${event.eventName}</h4>
                                        </li>
                                        <li class="list-group-item">
                                          <span class='eventLocation'>${event.location}</span>

                                          <!--- Google maps ----!>
                                          <div id="googleMap" style="width:300px;height:300px;"></div>
                                          <script>
                                          function myMap() {
                                            var mapProp= {
                                              center:new google.maps.LatLng(51.508742,-0.120850),
                                              zoom:5,
                                            };
                                            var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
                                          }
                                          </script>


                                          <span class='eventTime pull-right'>&#160;${event.time}</span>

                                          <span class='eventDate pull-right'>${event.date}</span>

                                        </li>
                                        <li class="list-group-item">
                                          <span class='eventDescription'>Hello students! Our next event will be held at 1-5PM. Chime in on this issue to join us as a mentor or student for this event!</span>
                                        </li>
                                        <li class="list-group-item">
                                          <span class='event-date'>19 people interested</span>
                                        </li>
                                        <li class="list-group-item">
                                          <h4 class="inline-header">Keywords:</h4>
                                          <span class='event-keywords'>${event.keywords}</span>
                                        </li>
                                      </ul>
                            <fieldset>

                        <ul class="pull-right" style="list-style-type:none">
                        <li><b>Event Name:</b>Text Here</li>
                        <li><b>Location:</b>City, State</li>
                        <li><b>Date:</b> 02/20/2017</li>
                        <li><b>Time:</b> 8:00</li>
                        </ul>
                            <img src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQaVz3lAJ2zFCc52NKlX6bTjajPRrzcFqQ15FB5Vd6G5sisWS2Vw4cWHPs" alt="event image">
                            <hr>
                            <b>Description:</b>
                            <p align="justify style="text-align:center">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam maximus magna neque, vitae cursus nunc mollis et.</p>
                            </fieldset>
                        <div class="form-group modal-footer">
                          <button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>

                </div>
              </div>
              </div>
            </div>
            <!-- end of event internal row -->

            </div>
          </div>
        </div>


    <!-- end one event -->
  `);
  $('.eventContainer').prepend(eventHtml);
} //closes renderEvent function


function handleSearchSubmit(e) {
  var $searchForm = $('#eventSearchForm');
  e.preventDefault();
  var query = $searchForm.val();
  console.log('You tried to search for', query);
  if (query === "") {
    $searchForm.focus();
    return;
  }

  // $loading.show(); // show loading gif

  $.ajax({
    method: 'GET',
    endpoint: '/api/keyword/?keyword=' + query,
    data: {
      type: 'keyword',
      keyword: query
    },
    success: handleEventSearch,
    error: handleEventSearchError
  });//closes ajax search request

  $searchForm.val(''); // clear the form fields
} //closes handleSearchSubmit


function handleEventSearch(json) {
  console.log('BLARG ', json);
}


function handleNewEventSubmit(e) {
  e.preventDefault();
  var $newEventModal = $('#newEventModal');
  var $name = $newEventModal.find('#name');
  var $eventLocation = $newEventModal.find('#eventLocation');
  var $eventDate = $newEventModal.find('#eventDate');
  var $email = $newEventModal.find('#posterEmail');
  var $links = $newEventModal.find('#externalResource');
  var $imageUrl = $newEventModal.find('#imageUrl');
  var $desc = $newEventModal.find('#eventDescription');
  var $eventTime= $newEventModal.find('#eventTime');
  var $tags= myTags;
  console.log("tags are ", myTags);
  // get data from modal fields
  var dataToPost = {
    eventName: $name.val(),
    location: $eventLocation.val(),
    date: $eventDate.val(),
    time: $eventTime.val(),
    posterEmail: $email.val(),
    externalResource: $links.val(),
    description: $desc.val(),
    imageUrl: $imageUrl.val(),
    keywords: myTags,
  };

  console.log('retrieved new event!', dataToPost);

    $.post('/api/events', dataToPost, function(data) {
      console.log('received data from post to /events:', dataToPost);
      //clear the form!
      $name.val('');
      $eventLocation.val('');
      $eventDate.val('');
      $eventTime.val('');
      $email.val('');
      $links.val('');
      $desc.val('');
      $imageUrl.val('');
      myTags = [];
      // close modal
      $newEventModal.modal('hide');
      renderEvent(data);
    }); //closes post request
} //closes function


function handleError(err) {
  console.log('error loading events!: ', err);
  $('.eventContainer').append('Sorry, there was a problem loading events.');
}

function handleEventSearchError(err) {
  console.log('error searching for an event: ', err);
}
