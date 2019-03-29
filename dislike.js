var CODE_NotificationAngryRURL = 'https://i.postimg.cc/xCTQBnfj/mini-3x.png';
var classForLikeEvent = '_6a-y _3l2t _18vj';

// HTML to add for dislike button
var lastSmily = `<span aria-pressed="false" role="button" aria-label="Dislike" class="_iuw" data-testid="reaction_9" href="#" tabindex="-1">
        <div class="_39m _1ef2" data-reaction="9">
            <div class="_39n"><div class="_1ef0" style="display: inline-block; line-height: 0; font-size: 0px;">
                <img style="width: 39px; height: 39px;" src="https://i.postimg.cc/xCTQBnfj/mini-3x.png">
            </div>
            <div class="_d61" style="position: absolute;top: -22px;"><div style="font-size: 10px;" class="_4sm1">Dislike</div></div></div></div></span>`;


var divSmilyContainer = "._iu-:not(.smilyAdded)";
var hoverClass        = "_iuy";  

//This will hide show like and dislike button
function hideMeCustom(e){

    // this will remove the dislike button with first person name (which have no likes)
    if(e.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].childElementCount == 1){
        e.parentNode.parentNode.parentNode.parentNode.firstElementChild.remove();
    }

    // Will show the like button after click on dislike buuton
    e.nextSibling.style.display = 'block';

    // This will remove the dislike button after click on dislike buuton
    e.remove();
} 


/*
** It will convert the numbers to show 1,000 would be 1K, 100,000 would be 100K, 1 million would be 1M.
*/
function nFormatter(num, digits) {
  var si = [
    { value: 1, symbol: "" },
    { value: 1E3, symbol: "k" },
    { value: 1E6, symbol: "M" },
    { value: 1E9, symbol: "G" },
    { value: 1E12, symbol: "T" },
    { value: 1E15, symbol: "P" },
    { value: 1E18, symbol: "E" }
  ];
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

addImage();
document.addEventListener("DOMNodeInserted", addImage, false);

var likeClickButton = document.querySelectorAll('._6a-y');
for (let likeBtn of likeClickButton) { 

    likeBtn.addEventListener("mouseover", function(){
        var restOfAll = document.getElementsByClassName('_6a-y active');
        for (let rest of restOfAll) {
            rest.classList.remove('active');
        }
        likeBtn.classList.add('active');        
    }); 
}




/**
 * This function will check if the elem has a given class or not if there then return true else false
 * Basic use of this function is along with closest function, it helps to find class while traveling from 
 * Child to Parent node in DOM  
 **/
function hasClass(elem, cls) {
    var str = " " + elem.className + " ";
    var testCls = " " + cls + " ";
    return(str.indexOf(testCls) != -1) ;
}

/**
 * This function will find the given class in parent node, 
 * It Travels from given node to parent node recursively untill the give class to find, match up
 * If given class wasn't found then return null else return the node element which contains that class.
 **/
function closest(el, cls) {
    while (el  && el !== document) {
        if (hasClass(el, cls)) return el;
        el = el.parentNode;
    }
    return null;
}
 
/**
 * DisLike Ajax Call 
 * This function use to call dislike button action to API, this will call the dislike button API and 
 * Update to database
 */
function disLikeAjax(postId) {
    var userData = document.querySelector("._606w").getAttribute("href"); 
    var params = userData.split('/');
    var userId = params[3];
    $.ajax({
        url : "https://socialexile.pythonanywhere.com/d/"+postId+"/"+userId+"/", // the endpoint
        type : "POST", // http method
        // handle a successful response
        success : function(json) {
        }
    }); 
}

/**
 * Get Dislike Button on ajax
 * This function will fetch all the dislike count on current page post
 * This will request for one post id and set the values to the dom 
 */
function getDislikeAjax(elem, postId){
    var userData = document.querySelector("._606w").getAttribute("href"); 
    var params = userData.split('/');
    var userId = params[3];
    $.ajax({
        url : "https://socialexile.pythonanywhere.com/s/"+postId+"/"+userId+"/", // the endpoint
        type : "POST", // http method
        // handle a successful response
        success : function(json) {

            if(json.thisuser == 'yes'){

                var likeClickEvent = elem.querySelector('._6a-y');    

                appendHTMLforDislikeButton(likeClickEvent);

                elem.querySelector('.removeDislike').addEventListener('click',
                    function(){
                        onRemoveDislikeButtonClick(this);
                });

            }
            if(json.total_downvote > 0) {
                appendNotificationWithcount(elem, json.total_downvote, json.thisuser);
            }

        }
    }); 
}


/**
 * Append HTML for Dislike Button 
 * After ajax call this functioon helps to set proper dom button for dislike liked on the post
 * This will hide the Like button and show dislike button there
 */
function appendHTMLforDislikeButton(elem)
{
    var newHTML =  `<a class="_6a-y _3l2t _18vj removeDislike" >
                        <img src="`+CODE_NotificationAngryRURL+`" height="18px" width="18px">
                        <span style="margin-left: 7px;">Dislike</span></a>`;

    // this will hide the like button 
    elem.parentNode.parentNode.style.display = 'none';

    // this will add the  dislike button with name of first user to dislike html to post which have no any likes yet.
    elem.parentNode.parentNode.insertAdjacentHTML("beforeBegin", newHTML);
}

/**
 * Append Notification with count on click of dislike image
 * On the top of the Dislike button we show counts and if current user disliked then show their name 
 * This function will set UI for that 
 * This is used when we click dislike button
 */
function appendNotificationWithcountOnClickDislikeImage(elem,postIdParent)
{
    //var likeCountAppend = elem.querySelector('._78bu'); 
    var likeAppend = $(elem).closest('._5pcr'); 
    var appendTo = $(likeAppend).find('._5pcp');

   /* if(appendTo.length == 0){
        var appendTo = $(likeAppend).find('._43_1');
    }*/
    $(likeAppend).find('.userContent').css('display','none');
    $(likeAppend).find('._3x-2').css('display','none');
    $(postIdParent).css('display','none');


    var textNoteSelector = $(appendTo[0]).find('.customCount');
    //return false;
    if(textNoteSelector.length == 0){
        // User Profile name who is first to dislike this post
        //var profileName = document.querySelector('._1vp5').innerText;
        customCount = nFormatter(1, 1);
        var dislikeDiv = '<span class="customCount" style="margin-left: 13px;position: absolute;margin-top: 1px;" data-count="1"><img src="'+CODE_NotificationAngryRURL+'" height="15px" width="15px"><span class="profile" style="margin-left: 4px;position: absolute;">'+customCount+'</span><span class="show-post" style="float:right;margin-left:60px;cursor:pointer;"> Show Post <i class="up" style="position: relative;top: -3px;display: inline-block;width: 5px;height: 5px;border-right: 0.2em solid black;border-top: 0.2em solid black;transform: rotate(135deg);margin-right: 0.5em;margin-left: 0.6em;"></i></span></span>';
        //var dislikeDiv = '<div class="customCount" data-count="1"><img src="'+CODE_NotificationAngryRURL+'" height="18px" width="18px"><span class="profile">'+profileName+'</span></div>';
        appendTo[0].insertAdjacentHTML('beforeend',dislikeDiv);

    }else{


        var currentCount = $(textNoteSelector).attr('data-count');
        currentCount = parseInt(currentCount) + 1;  
        textNoteSelector.remove();
        // User Profile name who is first to dislike this post
        //var profileName = document.querySelector('._1vp5').innerText;

        //var newCount = currentCount - 1;

       // profileName = (newCount > 0) ? profileName + ' and ' + newCount + ' Others' : profileName;

        currentCount = nFormatter(currentCount, 1);
        var dislikeDiv = '<span class="customCount" style="margin-left: 13px;position: absolute;margin-top: 1px;" data-count="'+currentCount+'"><img src="'+CODE_NotificationAngryRURL+'" height="15px" width="15px"><span class="profile" style="margin-left: 4px;position: absolute;">'+currentCount+'</span><span class="show-post" style="float:right;margin-left:60px;cursor:pointer;"> Show Post <i class="up" style="position: relative;top: -3px;display: inline-block;width: 5px;height: 5px;border-right: 0.2em solid black;border-top: 0.2em solid black;transform: rotate(135deg);margin-right: 0.5em;margin-left: 0.6em;"></i></span></span>';
        //var dislikeDiv = '<div class="_68wo customCount" data-count="'+currentCount+'" data-testid="fbFeedStoryUFI/feedbackSummary"><div class="_3vum"><div class="_66lg" style="padding:3px;"><span aria-label="See who reacted to this" class="_1n9r _66lh" role="toolbar"><span class="_1n9k" data-testid="UFI2TopReactions/tooltip_LIKE" tabindex="-1" data-hover="tooltip"><span class="_9zc _9-- _1n9q _3uet _4e-m"><img src="'+CODE_NotificationAngryRURL+'" height="18px" width="18px"></span></span></span><a ajaxify="/ufi/reaction/profile/dialog/?ft_ent_identifier=ZmVlZGJhY2s6MTIwMTA0MjYyMzM4NDQ4MQ%3D%3D&amp;av=100004362643460" href="/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MTIwMTA0MjYyMzM4NDQ4MQ%3D%3D&amp;av=100004362643460" rel="dialog" class="_3dlf" data-testid="UFI2ReactionsCount/root" tabindex="0" role="button"><span aria-hidden="true" class="_3dlg"><span class="_3dlh">1</span></span><span class="_3dlh _3dli" data-testid="UFI2ReactionsCount/sentenceWithSocialContext"><span class="profile">'+profileName+'</span></span></a></div></div></div>';
        appendTo[0].insertAdjacentHTML('beforeend',dislikeDiv);
        
    }

    var showPostButton = $(likeAppend).find('.show-post')[0];
    showPostButton.addEventListener("click", function(){
        showPost(this,likeAppend,postIdParent);

    }); 

}


/*
* it will convert the post to condensed view In short It will Hide show the post 
* and change text like "Show Post" and "Close Post" and related up and down arrows
*/
function showPost(current,likeCountAppend,postIdParent){

   if($(likeCountAppend).find("i.up").length == 1){
        $(likeCountAppend).find('.show-post').html('Close Post <i class="down" style="position: relative;top: 0px;display: inline-block;width: 5px;height: 5px;border-right: 0.2em solid black;border-top: 0.2em solid black;transform: rotate(-45deg);margin-right: 0.5em;margin-left: 0.6em;"></i>');
   }
   else
   {
        $(likeCountAppend).find('.show-post').html('Show Post <i class="up" style="position: relative;top: -3px;display: inline-block;width: 5px;height: 5px;border-right: 0.2em solid black;border-top: 0.2em solid black;transform: rotate(135deg);margin-right: 0.5em;margin-left: 0.6em;"></i>');
   }
    
    $(likeCountAppend).find('.userContent').toggle();
    $(likeCountAppend).find('._3x-2').toggle();
    $(postIdParent).toggle();
}

/**
 * Append Notification with count on click of dislike image
 * On the top of the Dislike button we show counts and if current user disliked then show their name 
 * This function will set UI for that 
 * This is used when we load the page and the posts
 */
function appendNotificationWithcount(elem, count, thisuser)
{
    //var likeCountAppend = elem.querySelector('._78bu'); 
    var likeCountAppend = $(elem).closest('._5pcr'); 

    var appendTo = $(likeCountAppend).find('._5pcp');


    $(likeCountAppend).find('.userContent').css('display','none');
    $(likeCountAppend).find('._3x-2').css('display','none');
    $(elem).css('display','none');
    var currentCount = count;

    currentCount = parseInt(currentCount); 
    currentCount = nFormatter(currentCount, 1);
    //var newCount = currentCount;
    //var profileName = document.querySelector('._1vp5').innerText;
   /* if(thisuser == 'yes'){
        var newCount = currentCount - 1;
        profileName = (newCount > 0) ? profileName + ' and ' + newCount + ' Other' : profileName;  
    }else {
        profileName = currentCount + ' Other';  
    }
*/
    var dislikeDiv = '<span class="customCount" style="margin-left: 13px;position: absolute;margin-top: 1px;" data-count="'+currentCount+'"><img src="'+CODE_NotificationAngryRURL+'" height="15px" width="15px"><span class="profile" style="margin-left: 4px;position: absolute;">'+currentCount+'</span><span class="show-post" style="float:right;margin-left:60px;cursor:pointer;">Show Post <i class="up" style="position: relative;top: -3px;display: inline-block;width: 5px;height: 5px;border-right: 0.2em solid black;border-top: 0.2em solid black;transform: rotate(135deg);margin-right: 0.5em;margin-left: 0.6em;"></i> </span></span>';
    //var dislikeDiv = '<div class="_68wo customCount" data-count="'+currentCount+'" data-testid="fbFeedStoryUFI/feedbackSummary"><div class="_3vum"><div class="_66lg" style="padding:3px;"><span aria-label="See who reacted to this" class="_1n9r _66lh" role="toolbar"><span class="_1n9k" data-testid="UFI2TopReactions/tooltip_LIKE" tabindex="-1" data-hover="tooltip"><span class="_9zc _9-- _1n9q _3uet _4e-m"><img src="'+CODE_NotificationAngryRURL+'" height="18px" width="18px"></span></span></span><a ajaxify="/ufi/reaction/profile/dialog/?ft_ent_identifier=ZmVlZGJhY2s6MTIwMTA0MjYyMzM4NDQ4MQ%3D%3D&amp;av=100004362643460" href="/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MTIwMTA0MjYyMzM4NDQ4MQ%3D%3D&amp;av=100004362643460" rel="dialog" class="_3dlf" data-testid="UFI2ReactionsCount/root" tabindex="0" role="button"><span aria-hidden="true" class="_3dlg"><span class="_3dlh">1</span></span><span class="_3dlh _3dli" data-testid="UFI2ReactionsCount/sentenceWithSocialContext"><span class="profile">'+profileName+'</span></span></a></div></div></div>';
    
    appendTo[0].insertAdjacentHTML('beforeend',dislikeDiv);
    var showPostButton = $(likeCountAppend).find('.show-post')[0];
    showPostButton.addEventListener("click", function(){
        showPost(this,likeCountAppend,elem);

    }); 

}
 
/**
 * On Remove Dislike Button Click
 * This function will set the UI back after removing dislike means undone dislike click for current user
 * this will reset the UI back for Like button
 */
function onRemoveDislikeButtonClick(elem)
{
     // this will remove the dislike button with first person name (which have no any likes)
    var parentFormId = closest(elem, 'commentable_item');
    //var likeCountAppend = elem.querySelector('._78bu'); 
    var likeCountAppend = $(parentFormId).closest('._5pcr'); 
    var appendTo = $(likeCountAppend[0]).find('._5pcp');


    var textNoteSelector = $(appendTo[0]).find('.customCount');
    //return false;
    if(textNoteSelector.length != 0){
        if( $(textNoteSelector).attr('data-count') == 1){
            $(textNoteSelector).remove();
        }else{
            var newCount =  $(textNoteSelector).attr('data-count');
            newCount = parseInt(newCount) - 1;
            $(textNoteSelector).attr('data-count', newCount);
            //var profile = newCount +' Other';    
            $(textNoteSelector).find('.profile').text(newCount);
        }
    }


    // Will show the like button after click on dislike buuton
    elem.nextSibling.style.display = 'block';

    //Call Ajax to Dislike 
    var postId = parentFormId.querySelector('input[name=ft_ent_identifier]').value;
    var userData = document.querySelector('._606w').getAttribute('href'); 
    var params = userData.split('/');
    var userId = params[3];
    var request = new XMLHttpRequest();
    var url = 'https://socialexile.pythonanywhere.com/d/'+postId+'/'+userId+'/';
    request.open('POST', url, true);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var jsonData = JSON.parse(request.response);
        }
    };

    request.send();
    // This will remove the dislike button after click on dislike buuton
    elem.remove();
}


// Add image on DOMNodeInserted
function addImage() {

    //Call Ajax to get Dislike 
    var elementToAppendAjax = document.querySelectorAll('.commentable_item:not(.getAjax)');
    if(elementToAppendAjax.length > 0) {
        for (let elem of elementToAppendAjax) {
            var postId =elem.querySelector('input[name=ft_ent_identifier]').value;
            getDislikeAjax(elem, postId);
            elem.classList.add("getAjax");
        }
    }
    
    document.removeEventListener("DOMNodeInserted", addImage, false);
    var elementToAppendSmily = document.querySelectorAll(divSmilyContainer);
        if(elementToAppendSmily.length > 0) {
            for (let elem of elementToAppendSmily ) {

            elem.insertAdjacentHTML('beforeend',lastSmily);
            elem.classList.add("smilyAdded");
            var dislikeImgHover =  document.querySelectorAll('span[aria-label="Dislike"]:not(.addedHover)');

            // Bind mousehover and out add and remove active class to append html
            var likeClickButton = document.querySelectorAll('._6a-y');
            for (let likeBtn of likeClickButton) {

                likeBtn.addEventListener("mouseover", function(){
                    var restOfAll = document.getElementsByClassName('_6a-y active');
                    for (let rest of restOfAll) {
                        rest.classList.remove('active');
                    }

                    likeBtn.classList.add('active');        
                }); 
            }

            // Bond mouseover and mouseout for dislike text which is show after hover on dislike icon
            for (let hover of dislikeImgHover) {
                hover.addEventListener("mouseover", function(){
                    hover.classList.add('_iuy');          
                }); 
                hover.addEventListener("mouseout", function(){
                    hover.classList.remove('_iuy');            
                }); 
                hover.classList.add("addedHover");

                // Bind click to dislike button on hover box
                hover.addEventListener("click", function()
                {

                    // Class to add dislike button html after click on dislike icon of hover box
                    var likeClickEvent = document.getElementsByClassName('_6a-y active')[0];
                    var styleIsDisplay =  likeClickEvent.closest('._666k');
                    var styleIsDisplayNone =  likeClickEvent.closest('._666k').getAttribute('style');

                    if(styleIsDisplay.style.display != 'none' || styleIsDisplayNone !=null){

                        //Dislike button html after click on dislike hover icon
                        appendHTMLforDislikeButton(likeClickEvent);

                        var postIdParent = closest(likeClickEvent, 'commentable_item');
                        var postId =postIdParent.querySelector('input[name=ft_ent_identifier]').value;
                        
                        //Call Ajax to Dislike 
                        disLikeAjax(postId);
                        

                        appendNotificationWithcountOnClickDislikeImage(likeClickEvent,postIdParent);

                        postIdParent.querySelector('.removeDislike').addEventListener('click',
                            function(){
                                onRemoveDislikeButtonClick(this);
                        });

                       
                    }
                    
                });
            }
        } 
    }
    document.addEventListener("DOMNodeInserted", addImage, false);
}

