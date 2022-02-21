let apiKey = "d7692980fe79006a4e3b17940a2cfd65";
let movieQuery =
  "https://api.themoviedb.org/3/genre/movie/list?api_key=d7692980fe79006a4e3b17940a2cfd65&language=en-US";
//let actionMoviesQuery = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=35`;
let configquery =
  "https://api.themoviedb.org/3/configuration?api_key=d7692980fe79006a4e3b17940a2cfd65";
  let popularQuery = "https://api.themoviedb.org/3/movie/popular?api_key=d7692980fe79006a4e3b17940a2cfd65&language=en-US&page=1";
const container = document.querySelector(".main-container");
const getData = async (query) => {
  const response = await fetch(query);
  const obj = response.json();
  return obj;
};
const generateMovies = (moviesList, genre) => {
  let header = document.createElement("h1");
  header.setAttribute("id", "myList");
  header.textContent = genre;
  let box = document.createElement("div");
  box.setAttribute("class", "box");
  //console.log(typeof moviesList);
  let c = 10;
  for (const key in moviesList) {
    if(c==0){
        break;
    }
    let imgurl = localStorage.getItem("imgurl");
    let backurl = localStorage.getItem("backurl");
    let a = document.createElement("a");
    let i = document.createElement("img");
    let path = moviesList[key]["poster_path"];
    let title = moviesList[key]["original_title"];
    let overview = moviesList[key]["overview"];
    imgurl = JSON.parse(imgurl);
    backurl = JSON.parse(backurl);
    backurl += moviesList[key]["backdrop_path"];
    imgurl += path;
    i.setAttribute("src", imgurl);
    //console.log(imgurl);
    a.appendChild(i);
    i.setAttribute('data-title',title);
    i.setAttribute('data-overview',overview);
    i.setAttribute('data-backdrop',backurl);
    box.appendChild(a);
    c--;
  }
  let br = document.createElement("br");
  container.appendChild(header);
  container.appendChild(br);
  container.appendChild(box);
};
const generateGenres = async (data) => {
  for (let i = 0; i < 6; i++) {
    //console.log(data.genres[i]);
    let moviesQuery = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${data.genres[i].id}`;
    let movies = await getData(moviesQuery);
   // console.log(movies.results);
    generateMovies(movies.results, data.genres[i].name);
  }
  const boxes = document.querySelectorAll('.box');
  let active = false;
  //console.log(typeof boxes,boxes);
  let prev = null;
  boxes.forEach(genrebox=>{
    genrebox.addEventListener('click',e=>{
        e.stopPropagation();
        if((e.target.tagName==="IMG" && !active) ||(e.target.tagName==="IMG" && prev && prev!==e.target) ){
            if(prev){
                let parent = prev.parentNode;
                let del = parent.nextSibling;
                //console.log(del);
                del.remove();
                //console.log('prev deleted');
            }
            let card = document.createElement("div");
            card.setAttribute('class','info-card');
            let movietitle = document.createElement("div");
            movietitle.setAttribute('class','title');
            let blur = document.createElement("div");
            blur.setAttribute('class','blur');
            let overviewText = document.createElement("p");
            overviewText.setAttribute('class','overview');
            let buttonContainer = document.createElement("div");
            buttonContainer.setAttribute('class','button-container');
            let button = document.createElement("button");
            button.textContent = "Play";
            buttonContainer.appendChild(button);
            movietitle.textContent = e.target.dataset.title;
            overviewText.textContent = e.target.dataset.overview;
            //console.log(e.target.dataset.backdrop);
            card.style.backgroundImage = `url('${e.target.dataset.backdrop}')`;
            card.appendChild(blur);
            card.appendChild(movietitle);
            card.appendChild(overviewText);
            card.appendChild(buttonContainer);
            let parent = e.target.parentNode;
            if(parent.nextSibling){
                parent.parentNode.insertBefore(card,parent.nextSibling);
            }else{
                parent.parentNode.appendChild(card);
            }
            active = true;
            prev = e.target;
            //console.log('added new card');
            //console.log('new prev',prev);
            const popup = document.querySelector('.popup-wrapper');
            const iframesrc = "https://www.youtube.com/embed/aWzlQ2N6qqg?start=1";
            const iframe = document.querySelector('.popup-wrapper iframe');
           // console.log(popup);
            //const close = document.querySelector('.close');
            button.addEventListener('click',()=>{
                popup.style.display = 'flex';
                iframe.setAttribute('src',iframesrc);
            });
            popup.addEventListener('click',()=>{
               // console.log('clicked');
                popup.style.display = 'none';
                iframe.setAttribute('src','')
            })
        }else if(active==true){
           // console.log('current prev',prev)
           // console.log('deleting curr card');
            let parent = e.target.parentNode;
            let del = parent.nextSibling;
            del.remove();
            active = false;
            prev = null;
        }
    })
  })
};

getData(movieQuery).then(data=>{
    generateGenres(data).then(()=>{
        console.log();
    }).catch(err=>{
        console.log(err);
    });
}).catch(err=>{
    console.log(err);
})

getData(configquery)
  .then(data=>{
     // console.log(typeof data, data);
      const baseurl = data.images.base_url;
      const size = data.images["poster_sizes"][3];
      const backsize = data.images["backdrop_sizes"][3];
      const imgurl = baseurl+size;
      const backurl = baseurl + backsize;
     // console.log(imgurl)
      localStorage.setItem("imgurl",JSON.stringify(imgurl));
      localStorage.setItem("backurl",JSON.stringify(backurl));
  })
  .catch((err) => console.log(err));


  const generateHero = (title,overview,backurl) => {
      let mainCon = document.querySelector('.hero-text-container > div');
      let hero = document.querySelector('.hero');
      let titleContainer = document.createElement("div");
      let overviewText = document.createElement("p");
      let buttonContainer = document.createElement("div");
      let button = document.createElement("button");
      button.textContent = "Play";
      buttonContainer.setAttribute('class','button-container');
      buttonContainer.appendChild(button);
      overviewText.textContent = overview;
      overviewText.setAttribute('class','overview');
      titleContainer.textContent = title;
      titleContainer.setAttribute('class','title');
      mainCon.appendChild(titleContainer);
      mainCon.appendChild(overviewText);
      mainCon.appendChild(buttonContainer);
      hero.style.backgroundImage = `url('${backurl}')`;
  }


 getData(popularQuery).then(data=>{
     console.log(data);
     if(localStorage.getItem('i')){
         i = JSON.parse(localStorage.getItem('i')) % 20;
     }else{
         i = 0;
         localStorage.setItem('i',JSON.stringify(i));
     }
     console.log(i);
     console.log(data["results"][i]);
     let title = data["results"][i].original_title;
     let overview = data["results"][i].overview;
     let backurl = localStorage.getItem('backurl');
     backurl = JSON.parse(backurl);
     backurl += data["results"][i].backdrop_path;
     generateHero(title,overview,backurl);
     i++;
     localStorage.setItem('i',JSON.stringify(i));
     const button = document.querySelector('.hero-text-container button');
     const popup = document.querySelector('.popup-wrapper');
            const iframesrc = "https://www.youtube.com/embed/aWzlQ2N6qqg?start=1";
            const iframe = document.querySelector('.popup-wrapper iframe');
           // console.log(popup);
            //const close = document.querySelector('.close');
            button.addEventListener('click',()=>{
                popup.style.display = 'flex';
                iframe.setAttribute('src',iframesrc);
            });
            popup.addEventListener('click',()=>{
               // console.log('clicked');
                popup.style.display = 'none';
                iframe.setAttribute('src','')
            })
 }).catch(err=>{
     console.log(err);
 })