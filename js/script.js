//https://gist.github.com/tlhunter/0ea604b77775b3e7d7d25ea0f70a23eb
function averageGeolocation(coords) {
  if (coords.length === 1) {
    return coords[0];
  }

  let x = 0.0;
  let y = 0.0;
  let z = 0.0;

  for (let coord of coords) {
    let latitude = coord.latitude * Math.PI / 180;
    let longitude = coord.longitude * Math.PI / 180;

    x += Math.cos(latitude) * Math.cos(longitude);
    y += Math.cos(latitude) * Math.sin(longitude);
    z += Math.sin(latitude);
  }

  let total = coords.length;

  x = x / total;
  y = y / total;
  z = z / total;

  let centralLongitude = Math.atan2(y, x);
  let centralSquareRoot = Math.sqrt(x * x + y * y);
  let centralLatitude = Math.atan2(z, centralSquareRoot);

  return {
    latitude: centralLatitude * 180 / Math.PI,
    longitude: centralLongitude * 180 / Math.PI
  };
}


let map,icon,icon2,shape;
let markers = [];
let infowindow;

function initMap() {
     icon = {
        url: "./icons/blue-20.png",
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(20, 32),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(0, 32),
      };
      icon2 = {
        url: "./icons/red-20.png",
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(20, 32),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(0, 32),
      };
      // Shapes define the clickable region of the icon. The type defines an HTML
      // <area> element 'poly' which traces out a polygon as a series of X,Y points.
      // The final coordinate closes the poly by connecting to the first coordinate.
     shape = {
    coords: [1, 1, 1, 20, 18, 20, 18, 1],
    type: "poly",
    };

}

// Adds a marker to the map and push to the array.
function addMarker(position, icon, meta) {

  const marker = new google.maps.Marker({
    position,
    map,
    icon,
    shape
  });
  marker.metadata = meta;
  //todo: write tooltip, click event
    marker.addListener('click', function(e, m) {
        infowindow && infowindow.close();
        $('#restaurant_reviews').empty()
        meta = this.metadata
        infowindow =  new google.maps.InfoWindow({
            content: `<div><p><b>Restaurant Name</b>: ${meta.name}</p>
            <p><b>Address</b>: ${meta.full_address}</p>
            <p><b>Categories</b>: ${meta.categories.join(', ')}</p>
            <p><b>Rating</b>: ${meta.stars}</p>
            <p><b>Hygiene</b>: ${meta.hygiene == 0 ? "Passed" : "Failed"}</p>
            </div>`,
            map: map,
            position: position
        });
        infowindow.open(map, this);
        showReviewText(meta.reviews);
    });

  markers.push(marker);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function hideMarkers() {
  setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  hideMarkers();
  markers = [];
}

function showReviewText(reviews){
    _.each(reviews, function(r){
        $('#restaurant_reviews').append(`<li>
            <span><b>Rating</b>: ${r.review_stars}</span>
            <p><b>Review</b>: <i>${r.text}</i></p>
        </li>`)
    })
}

function fetchReview(reviews, zoom){
    deleteMarkers();
    $('#restaurant_reviews').empty()
    var all_cords = _.chain(reviews).map((r)=>{ return {latitude: r.latitude, longitude: r.longitude}}).value();
    if(all_cords.length){
        var centercords = averageGeolocation(all_cords)

        const centermap = { lat: centercords.latitude, lng: centercords.longitude };
        map = new google.maps.Map(document.getElementById("map"), {
            zoom: zoom || 10,
            center: centermap,
            mapTypeId: "satellite",
        });

        map.addListener('click', function(e, m) {
            infowindow && infowindow.close();
        })

        if(zoom > 13){
            map.setTilt(45);
        }

        _.each(reviews, (r)=>{
            let markercords = { lat: r.latitude, lng: r.longitude }
            addMarker(markercords, r.hygiene == 0? icon : icon2, r);

        })

    }

}

const allCuisines = [{key: "", value: ""},{'value': 'Chinese', 'key': 'Chinese'}, {'value': 'Halal', 'key': 'Halal'}, {'value': 'French', 'key': 'French'}, {'value': 'Internet Cafes', 'key': 'Internet_Cafes'}, {'value': 'Chocolatiers & Shops', 'key': 'Chocolatiers_&_Shops'}, {'value': 'Tapas/Small Plates', 'key': 'Tapas-Small_Plates'}, {'value': 'Amusement Parks', 'key': 'Amusement_Parks'}, {'value': 'Medical Spas', 'key': 'Medical_Spas'}, {'value': 'Burgers', 'key': 'Burgers'}, {'value': 'Nightlife', 'key': 'Nightlife'}, {'value': 'Hospitals', 'key': 'Hospitals'}, {'value': 'Comfort Food', 'key': 'Comfort_Food'}, {'value': 'Fast Food', 'key': 'Fast_Food'}, {'value': 'Party & Event Planning', 'key': 'Party_&_Event_Planning'}, {'value': 'Polish', 'key': 'Polish'}, {'value': 'Steakhouses', 'key': 'Steakhouses'}, {'value': 'Food Court', 'key': 'Food_Court'}, {'value': 'Soup', 'key': 'Soup'}, {'value': 'Cambodian', 'key': 'Cambodian'}, {'value': 'Gay Bars', 'key': 'Gay_Bars'}, {'value': 'Automotive', 'key': 'Automotive'}, {'value': 'Modern European', 'key': 'Modern_European'}, {'value': 'Latin American', 'key': 'Latin_American'}, {'value': 'Gift Shops', 'key': 'Gift_Shops'}, {'value': 'Event Planning & Services', 'key': 'Event_Planning_&_Services'}, {'value': 'Fondue', 'key': 'Fondue'}, {'value': 'Active Life', 'key': 'Active_Life'}, {'value': 'American (Traditional)', 'key': 'American_(Traditional)'}, {'value': 'Street Vendors', 'key': 'Street_Vendors'}, {'value': 'Bagels', 'key': 'Bagels'}, {'value': 'Delis', 'key': 'Delis'}, {'value': 'Malaysian', 'key': 'Malaysian'}, {'value': 'Afghan', 'key': 'Afghan'}, {'value': 'Buffets', 'key': 'Buffets'}, {'value': 'Dance Clubs', 'key': 'Dance_Clubs'}, {'value': 'Health Markets', 'key': 'Health_Markets'}, {'value': 'Farmers Market', 'key': 'Farmers_Market'}, {'value': 'Cafes', 'key': 'Cafes'}, {'value': 'Cheesesteaks', 'key': 'Cheesesteaks'}, {'value': 'Mexican', 'key': 'Mexican'}, {'value': 'Hotels', 'key': 'Hotels'}, {'value': 'Canadian (New)', 'key': 'Canadian_(New)'}, {'value': 'Tapas Bars', 'key': 'Tapas_Bars'}, {'value': 'Sports Bars', 'key': 'Sports_Bars'}, {'value': 'Personal Shopping', 'key': 'Personal_Shopping'}, {'value': 'Moroccan', 'key': 'Moroccan'}, {'value': 'Dominican', 'key': 'Dominican'}, {'value': 'Wine Bars', 'key': 'Wine_Bars'}, {'value': 'Turkish', 'key': 'Turkish'}, {'value': 'Shaved Ice', 'key': 'Shaved_Ice'}, {'value': 'Grocery', 'key': 'Grocery'}, {'value': 'Irish', 'key': 'Irish'}, {'value': 'African', 'key': 'African'}, {'value': 'Tea Rooms', 'key': 'Tea_Rooms'}, {'value': 'Shopping Centers', 'key': 'Shopping_Centers'}, {'value': 'Caribbean', 'key': 'Caribbean'}, {'value': 'Peruvian', 'key': 'Peruvian'}, {'value': 'Soul Food', 'key': 'Soul_Food'}, {'value': 'Kosher', 'key': 'Kosher'}, {'value': 'German', 'key': 'German'}, {'value': 'Bubble Tea', 'key': 'Bubble_Tea'}, {'value': 'Sushi Bars', 'key': 'Sushi_Bars'}, {'value': 'Vietnamese', 'key': 'Vietnamese'}, {'value': 'Colombian', 'key': 'Colombian'}, {'value': 'Spanish', 'key': 'Spanish'}, {'value': 'Ethiopian', 'key': 'Ethiopian'}, {'value': 'Food Stands', 'key': 'Food_Stands'}, {'value': 'Dry Cleaning & Laundry', 'key': 'Dry_Cleaning_&_Laundry'}, {'value': 'Japanese', 'key': 'Japanese'}, {'value': 'Salad', 'key': 'Salad'}, {'value': 'Fish & Chips', 'key': 'Fish_&_Chips'}, {'value': 'Pizza', 'key': 'Pizza'}, {'value': 'Taiwanese', 'key': 'Taiwanese'}, {'value': 'Filipino', 'key': 'Filipino'}, {'value': 'Hot Pot', 'key': 'Hot_Pot'}, {'value': 'Mongolian', 'key': 'Mongolian'}, {'value': 'Portuguese', 'key': 'Portuguese'}, {'value': 'Live/Raw Food', 'key': 'Live-Raw_Food'}, {'value': 'Food Trucks', 'key': 'Food_Trucks'}, {'value': 'Specialty Food', 'key': 'Specialty_Food'}, {'value': 'Korean', 'key': 'Korean'}, {'value': 'Seafood', 'key': 'Seafood'}, {'value': 'Food', 'key': 'Food'}, {'value': 'Pakistani', 'key': 'Pakistani'}, {'value': 'Slovakian', 'key': 'Slovakian'}, {'value': 'Bowling', 'key': 'Bowling'}, {'value': 'Kitchen & Bath', 'key': 'Kitchen_&_Bath'}, {'value': 'Coffee & Tea', 'key': 'Coffee_&_Tea'}, {'value': 'Food Delivery Services', 'key': 'Food_Delivery_Services'}, {'value': 'Creperies', 'key': 'Creperies'}, {'value': 'Tex/Mex', 'key': 'Tex-Mex'}, {'value': 'Chicken Wings', 'key': 'Chicken_Wings'}, {'value': 'Venues & Event Spaces', 'key': 'Venues_&_Event_Spaces'}, {'value': 'Scandinavian', 'key': 'Scandinavian'}, {'value': 'Convenience Stores', 'key': 'Convenience_Stores'}, {'value': 'Juice Bars & Smoothies', 'key': 'Juice_Bars_&_Smoothies'}, {'value': 'Bakeries', 'key': 'Bakeries'}, {'value': 'Russian', 'key': 'Russian'}, {'value': 'Gas & Service Stations', 'key': 'Gas_&_Service_Stations'}, {'value': 'Real Estate', 'key': 'Real_Estate'}, {'value': 'Pretzels', 'key': 'Pretzels'}, {'value': 'Southern', 'key': 'Southern'}, {'value': 'Cantonese', 'key': 'Cantonese'}, {'value': 'Belgian', 'key': 'Belgian'}, {'value': 'Ukrainian', 'key': 'Ukrainian'}, {'value': 'Bistros', 'key': 'Bistros'}, {'value': 'British', 'key': 'British'}, {'value': 'Himalayan/Nepalese', 'key': 'Himalayan-Nepalese'}, {'value': 'Scottish', 'key': 'Scottish'}, {'value': 'Vegetarian', 'key': 'Vegetarian'}, {'value': 'Indian', 'key': 'Indian'}, {'value': 'Cocktail Bars', 'key': 'Cocktail_Bars'}, {'value': 'Drugstores', 'key': 'Drugstores'}, {'value': 'Colleges & Universities', 'key': 'Colleges_&_Universities'}, {'value': 'Seafood Markets', 'key': 'Seafood_Markets'}, {'value': 'American (New)', 'key': 'American_(New)'}, {'value': 'Barbeque', 'key': 'Barbeque'}, {'value': 'Auto Repair', 'key': 'Auto_Repair'}, {'value': 'Fruits & Veggies', 'key': 'Fruits_&_Veggies'}, {'value': 'Shopping', 'key': 'Shopping'}, {'value': 'Hotels & Travel', 'key': 'Hotels_&_Travel'}, {'value': 'Brasseries', 'key': 'Brasseries'}, {'value': 'Beer Bar', 'key': 'Beer_Bar'}, {'value': 'Hawaiian', 'key': 'Hawaiian'}, {'value': 'Sandwiches', 'key': 'Sandwiches'}, {'value': 'Beer, Wine & Spirits', 'key': 'Beer,_Wine_&_Spirits'}, {'value': 'Breweries', 'key': 'Breweries'}, {'value': 'Desserts', 'key': 'Desserts'}, {'value': 'Middle Eastern', 'key': 'Middle_Eastern'}, {'value': 'Greek', 'key': 'Greek'}, {'value': 'Cajun/Creole', 'key': 'Cajun-Creole'}, {'value': 'Champagne Bars', 'key': 'Champagne_Bars'}, {'value': 'Breakfast & Brunch', 'key': 'Breakfast_&_Brunch'}, {'value': 'Gastropubs', 'key': 'Gastropubs'}, {'value': 'Karaoke', 'key': 'Karaoke'}, {'value': 'Diners', 'key': 'Diners'}, {'value': 'Arts & Entertainment', 'key': 'Arts_&_Entertainment'}, {'value': 'Lounges', 'key': 'Lounges'}, {'value': 'Laotian', 'key': 'Laotian'}, {'value': 'Hot Dogs', 'key': 'Hot_Dogs'}, {'value': 'Cuban', 'key': 'Cuban'}, {'value': 'Social Clubs', 'key': 'Social_Clubs'}, {'value': 'Mediterranean', 'key': 'Mediterranean'}, {'value': 'Local Flavor', 'key': 'Local_Flavor'}, {'value': 'Gluten/Free', 'key': 'Gluten-Free'}, {'value': 'Lebanese', 'key': 'Lebanese'}, {'value': 'Singaporean', 'key': 'Singaporean'}, {'value': 'Dive Bars', 'key': 'Dive_Bars'}, {'value': 'Thai', 'key': 'Thai'}, {'value': 'Bangladeshi', 'key': 'Bangladeshi'}, {'value': 'Burmese', 'key': 'Burmese'}, {'value': 'Ice Cream & Frozen Yogurt', 'key': 'Ice_Cream_&_Frozen_Yogurt'}, {'value': 'Music Venues', 'key': 'Music_Venues'}, {'value': 'Argentine', 'key': 'Argentine'}, {'value': 'Cinema', 'key': 'Cinema'}, {'value': 'Basque', 'key': 'Basque'}, {'value': 'Indonesian', 'key': 'Indonesian'}, {'value': 'Persian/Iranian', 'key': 'Persian-Iranian'}, {'value': 'Egyptian', 'key': 'Egyptian'}, {'value': 'Asian Fusion', 'key': 'Asian_Fusion'}, {'value': 'Italian', 'key': 'Italian'}, {'value': 'Donuts', 'key': 'Donuts'}, {'value': 'Butcher', 'key': 'Butcher'}, {'value': 'Brazilian', 'key': 'Brazilian'}, {'value': 'Vegan', 'key': 'Vegan'}]

$(function() {

    $('#cuisine').select2({
        placeholder: 'Select a cuisine',
        theme: "classic",
        allowClear:true,
        width: "200px"
    });
    $('#zip').select2({
        placeholder: 'Select a zip',
        theme: "classic",
        allowClear:true,
        width: "200px"
    });

    $('#cuisine').empty()
    _.each(allCuisines, function(c){
        $('#cuisine').append($('<option>').text(c.value).attr('value',c.key));
    })

    $('#zip').empty()
    $('#restaurant_reviews').empty()

    var cusine_resp = {};
    $('#cuisine').on('change', function(){
        var cuisine = $('#cuisine').val()
        if(cuisine){
            $.ajax({
              dataType: "json",
              url: "./output/categories/" + cuisine + ".json",
              success: function(res){
                //set zip select options
                cusine_resp = res;
                console.log(res.zipcodes);
                var all_zips = _.chain(res.zipcodes).keys().filter(z=>!isNaN(+z)).value();
                var all_reviews = _.chain(res.zipcodes).filter((v, z)=>!isNaN(+z)).values().flatten().value();

                $('#zip').empty()
                $('#zip').append($('<option>').text("").attr('value',""));
                _.each(all_zips, function(z){
                    $('#zip').append($('<option>').text(z).attr('value',z));
                })
                fetchReview(all_reviews, 4)

              }
            });
        }else{
            $('#zip').empty()
        }
        // fetch the cuisine json an generate the zip codes
    });

    $('#zip').on('change', function(){
        var sel_zip = $('#zip').val()
        if(sel_zip){
            var all_reviews = cusine_resp.zipcodes[sel_zip]
            fetchReview(all_reviews, 14)
        }else{
            var all_reviews = _.chain(cusine_resp.zipcodes).filter((v, z)=>!isNaN(+z)).values().flatten().value();
            fetchReview(all_reviews, 4)
        }

        console.log(cusine_resp.zipcodes[sel_zip])
    });

});
