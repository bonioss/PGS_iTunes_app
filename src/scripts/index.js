import '../styles/index.scss';
import * as pagination from './pagination.js';
import $ from "jquery";


const API = 'http://crossorigin.me/https://itunes.apple.com/search?term=';
const musicSearch = document.querySelector('#Search');
const searchBar = document.querySelector('.search__btn');
const songsList = '.results';
const info = '.info';

(()=>{ 
  searchBar.addEventListener('click', addSongs);
  document.addEventListener('keypress', function (event) {
    if (event.keyCode === 13 || event.which === 13) {
      addSongs(event);
    }
});
})();

const getSongs  = async (params) =>{ 
  try {
    const result = await fetch (`http://itunes.apple.com/search?term=${params}&entity=song`);
    return await result.json();

  } catch (e) { 
  console.error(e);
  }
};

function addSongs(e){
  let html, html2,  newHtml, newHtml2, dataSongs;
  
  html = '<div class="card" id="child-%id%"> <div class="card__picture"> <img src="%image%" alt=""> </div> <div class="card__info"><strong class="card__info_song">%song%</strong><p class="card__info__artist_name">%Artist%</p></div></div>';
  html2 = '<p id="info">Found %quantity% songs</p';
  //dataSongs=[];
  for(var j=0; j<50*(document.querySelector('.results').childElementCount);j++){
    document.querySelector('.card').remove(1); 
  }
  if(musicSearch.value===""){ 
    //location.reload();
    html2 = '<p id="info">Sorry, no matches found</p>';
    document.getElementById('info').innerHTML = html2;
  } else {   
   
    getSongs(musicSearch.value).then(data => {
      dataSongs = data;
      newHtml2 = html2.replace('%quantity%', dataSongs.results.length);
      document.getElementById('info').innerHTML = newHtml2;
      //console.log(document.querySelector('.results').childElementCount);
      for(var i = 0; i<dataSongs.results.length; i++){
          console.log("here");
          newHtml = html.replace('%id%', i); 
          newHtml = newHtml.replace('%image%', dataSongs.results[i].artworkUrl100); // expresion 
          newHtml = newHtml.replace('%song%', dataSongs.results[i].trackName);
          newHtml = newHtml.replace('%Artist%', dataSongs.results[i].artistName);
  
          document.querySelector(songsList).insertAdjacentHTML('beforeend', newHtml);
      }
      $(".card").paginate(9);
    
    });

  }
  
  
}
