/*
** file: js/main.js
** description: javascript code for "html/main.html" page
*/
var config = {
    apiKey: "AIzaSyC9B4RVVakcT3P3Rp2sDo53Ei5ji28Oz2E",
    authDomain: "shareit-33896.firebaseapp.com",
    databaseURL: "https://shareit-33896.firebaseio.com",
    projectId: "shareit-33896",
    storageBucket: "shareit-33896.appspot.com",
    messagingSenderId: "2410655609"
};

var link = "";
var id =  "";
var type = "";
var quality = "";
var heb_sub = false;
var el = null;
var season = 1;
var episode = 1;
var dd_season;
var dd_index = 0;

$('#dd_episode').prop('disabled', 'disabled');


function init_main () {

    firebase.initializeApp(config);

    var search_results = [];
    
    $('#tnxmsg').hide();
    $('#search-results').hide();
    $('#season-con').hide();
    $('#episode-con').hide();
    $('html').hide().fadeIn('slow');
    $('#share-button').hide();
    
    $("#link-input").prop('disabled',true);
        
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        link = tabs[0].url;

        $("#link-input").html(link);
            
    });

    

    $('#share-button').click(function(){


        firebase.database().ref(el.type + '/' + el.id).once('value').then(function(snapshot) {

            if(snapshot.val() == null){
                 $.get("https://api.themoviedb.org/3/" + el.type + "/" + el.id + "?api_key=cde34a267c3dd1d2a79ca5ba32f7192f&language=he-HE", function(data, status){

                    firebase.database().ref(el.type + '/' + el.id ).set(data).then(()=>{
                
                    });

                });
        
            }
            
                if(el.type == "tv")
                    {
                        

                        $.get("https://api.themoviedb.org/3/" + el.type + "/" + el.id +"/season/"+ $("#dd_season").val() + "?api_key=cde34a267c3dd1d2a79ca5ba32f7192f&language=he-HE", function(season, status){ 
                        
                            firebase.database().ref(el.type + '/' + el.id +'/seasons/'+ dd_index).set(season);
                        });                            

                        firebase.database().ref("links/" + el.type + "/" + el.id + "/").push({
                            season:dd_index,
                            episode:$("#dd_episode").val(),
                            uid: "",
                            uname: "guast",
                            vote:0,
                            heb_sub:$("#hebsub").is(":checked"),
                            is_active:true,
                            quality:$("#qselect option:selected").text(),                
                            url:link
                        });
    
                    }
                    else
                        firebase.database().ref("/links/" + el.type + "/" + el.id + "/").push({
                            uid: "",
                            uname: "guast",
                            vote:0,
                            heb_sub:$("#hebsub").is(":checked"),
                            is_active:true,
                            quality:$("#qselect option:selected").text(),
                            url:link
                        }); 



            

            $('#thanks-msg').show();
            
            
                    setTimeout(()=>{
                        window.close();
                    },1000);
            
        });
        
     });

    $('#search-input').keyup(function(){

        if(search_results == [])
            $('#search-results').hide();

        if ($('#search-input').val() == '')
            $('#search-results').hide();

        $.get("https://api.themoviedb.org/3/search/multi?api_key=cde34a267c3dd1d2a79ca5ba32f7192f&language=he-HE&query=" +  $('#search-input').val() + "&page=1&include_adult=false", function(data, status){
            search_results = [];

            data['results'].forEach(function(element) {
                 search_results.push({year : (element.release_date || element.first_air_date) ,id:element.id,type:element.media_type,title:(element.title || element.name)});
             }, this);

             $('#search-results').html('');

             var i = 0;
             search_results.forEach(function(element){
                if (i<5)
                    $('#search-results').append('<div class="search-re" data-index="' + search_results.indexOf(element) + '" >' + element.title + " (" + element.year.slice(0,4) + ")" + '</div>')
                i++;
             });
             
             $('#search-results').fadeIn();

        }); 

    });

    $(document).on('click','.search-re', function(e){
        el = search_results[$(this).attr('data-index')];

        if(el.type == "tv")
        {

            $.get("https://api.themoviedb.org/3/" + el.type + "/" + el.id + "?api_key=cde34a267c3dd1d2a79ca5ba32f7192f&language=he-HE", function(el, status){ 
                
                dd_season = el;
                var i = 0;
                el.seasons.forEach(function(element) {
                    $('#dd_season').append('<option data-index="'+ i +'" class="sss" value="' + element.season_number + '" >' + element.season_number  + '</option>')                    
                    i++;
                }, this);    
                
            });      /* + " (" + element.year.slice(0,4) + ")" */

            $('#season-con').fadeIn();
            $('#episode-con').fadeIn();        
        }
        
                console.log(el);
                
                $("#search-input").fadeOut();
                $('.search-re').fadeOut();        
                $('#share-button').fadeIn();
    });

    $("#dd_season").change(()=>{

        console.log($("#dd_season").val(),$('#dd_season option:selected').attr('data-index'));
        dd_index = $('#dd_season option:selected').attr('data-index');
        $('#dd_episode').prop('disabled', false);
        $('#dd_episode').html('');
        dd_season.seasons.forEach(function(element) {
            if (element.season_number == $("#dd_season").val())
                {
                    for (var index = 1; index <= element.episode_count; index++) {
                        
                        $('#dd_episode').append('<option  value="' + index + '" >' + index + '</option>')                    
                       
                    }

                }
        }, this);
        

    });

    $(document).on('click','.sss', function(e){

        console.log(e);
    });







}

//bind events to dom elements
document.addEventListener('DOMContentLoaded', init_main);