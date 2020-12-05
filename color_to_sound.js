
window.addEventListener("load", ()=>
{


  initCanvas();
  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------


  //will sound notes, but this are
  // the minimun and maximum values
  let noteValues =
  {
    'E4': 329.63,
    'C8': 4186.01
  }

  let oscilators_list = [];

  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------


  // inputs -----------------------------
  let red_input = document.getElementById("red_input");

  let green_input = document.getElementById("green_input");

  let blue_input = document.getElementById("blue_input");


  // buttons -----------------------------
  let btn_play_color = document.getElementById("btn_play");

  let btn_play_image = document.getElementById("btn_play_img");
  
  let btn_play_canvas = document.getElementById("btn_play_canvas");

  let btn_stop_img = document.getElementById("btn_stop_img");
  let btn_stop_img2 = document.getElementById("btn_stop_img2");



  // color block -----------------------------  
  let color_block = document.getElementById("color_block");
  color_block.style.backgroundColor = "rgb(0,0,255)";





  //-------------------------------------------------------------
  //-------------------------------------------------------------
  let uploaded_img_canvas = document.getElementById("img_canvas");

  let input_img_el = document.getElementById("img_input");

  input_img_el.accept = "image/*";

  let file_name_label = document.getElementById("img_file_name");

  let hasImageChanged = false;

  // load the image in the canvas to get the pixels later
  //-------------------------------------------------------------
  input_img_el.onchange = ()=>
  {
      let ctx = uploaded_img_canvas.getContext("2d");

      let uploaded_img = new Image();
      uploaded_img.crossOrigin = 'anonymous';
      uploaded_img.src =  window.URL.createObjectURL(input_img_el.files[0]);

      file_name_label.innerText = input_img_el.files[0].name;
      
      uploaded_img.onload = ()=>
      {
        uploaded_img_canvas.width = uploaded_img.width;
        uploaded_img_canvas.height = uploaded_img.height;

        ctx.clearRect(0, 0, uploaded_img_canvas.width, uploaded_img_canvas.height);
        ctx.drawImage(uploaded_img,0, 0);
      };


      hasImageChanged = true;

  };




  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------
  const showColor = ()=>
  {
    let r = red_input.value;
    let g = green_input.value;
    let b = blue_input.value;
    
    color_block.style.backgroundColor = `rgb(${r},${g},${b})`;
  }





  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------

  let color_selector = document.getElementById("color_selector");

  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------
  const setColors =  (r_i,g_i,b_i)=>
  {

    let color = color_selector.value;

    let r = parseInt(color.substr(1,2), 16);
    let g = parseInt(color.substr(3,2), 16);
    let b = parseInt(color.substr(5,2), 16);

    r_i.value = `${r}`;
    g_i.value = `${g}`;
    b_i.value = `${b}`;

    showColor();
  };


  color_selector.addEventListener("input", ()=> setColors(red_input,green_input,blue_input), false);



  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------

  let audioCtx = new AudioContext();


  //--------------------------------------------------------------------------------
  const playColor = ()=>
  {

    //plaint the block with the actual color
    showColor();

    let isWhite = false;
    
    
    // check user input
    let r = red_input.value === "" ? 0 : red_input.value.replace(/(\D)/g,"");
    let g = green_input.value === "" ? 0 : green_input.value.replace(/(\D)/g,"");
    let b = blue_input.value === "" ? 0 : blue_input.value.replace(/(\D)/g,"");
    
    if( parseInt(r) >= 255)
    {
      r = 255;
    }
    if(parseInt(g) >= 255)
    {
      g = 255;
    }
    if(parseInt(g) >= 255)
    {
      b = 255;
    }


    if(((r === 255) && (g === 255) && (b === 255)))
    {
      isWhite = true;
      r = 0;
      g = 0;
      b = 0;
    }
    else
    {

      //convert the rgb values in valid
      // frecuencies distributed
      // in a certain range
      // check the link in the post
      //  for the complete frecuency table
      r =  Math.floor(parseInt(r) * 5.475);
      g =  Math.floor(parseInt(g) * 5.475);
      b =  Math.floor(parseInt(b) * 5.475);
    }


    //the most simple approach
    let rgb_frequency = r + g + b;

    console.log(rgb_frequency);
    
    //put the min and max frecuency
    // for an rgb combination
    if(rgb_frequency === 0 && (isWhite === false))
    {
      rgb_frequency = noteValues["E4"];
    }
    else if(rgb_frequency > 4186)
    {
      rgb_frequency = noteValues["C8"];
    }


    //-------------------------------------------------------------
    //-------------------------------------------------------------
    //sound part
    let duration = 1;
    let gain_value = 0.7;

    
    // set the audio nodes for the output sound
    //---------------------------------------------------------
    //---------------------------------------------------------
    let oscillatorNode = audioCtx.createOscillator();
    oscillatorNode.type = "sine";
    oscillatorNode.frequency.value = rgb_frequency;
    oscillatorNode.start(0);
    
    //---------------------------------------------------------
    //---------------------------------------------------------
    let gainNode = audioCtx.createGain();
    
    
    //---------------------------------------------------------
    //---------------------------------------------------------
    let compressor = audioCtx.createDynamicsCompressor();
    
    //---------------------------------------------------------
    //---------------------------------------------------------
    let biquadFilter = audioCtx.createBiquadFilter();
    biquadFilter.type = "bandpass";
    

    gainNode.gain.exponentialRampToValueAtTime(gain_value, audioCtx.currentTime + duration);
    gainNode.gain.setTargetAtTime(1/1000, audioCtx.currentTime + duration , 0.02);

    compressor.threshold.setValueAtTime(-100, audioCtx.currentTime);
    compressor.knee.setValueAtTime(40, audioCtx.currentTime);
    compressor.ratio.setValueAtTime(20, audioCtx.currentTime);
    compressor.attack.setValueAtTime(0, audioCtx.currentTime);
    compressor.release.setValueAtTime(0.25, audioCtx.currentTime);
    
    biquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
    biquadFilter.gain.setValueAtTime(gain_value * 1.5, audioCtx.currentTime);
    

    
    oscillatorNode.connect(biquadFilter);
    biquadFilter.connect(gainNode);
    gainNode.connect(compressor);
    compressor.connect(audioCtx.destination);
    
    oscillatorNode.stop(audioCtx.currentTime + duration);

  }


  //---------------------------
  btn_play_color.addEventListener("click", playColor);













  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------

  let startScheduler = false;
  let currentNote = 0;

  //---------------------------------------------------------------------
  //---------------------------------------------------------------------
  //---------------------------------------------------------------------
  const playImage = (canvas_str,is_img_upload = false)=>
  {

    if((is_img_upload === true) && (!input_img_el.files[0])) 
    {
      return;
    }


    // set canvas ref ----------------------------------------------
    let canvas_ref = document.getElementById(canvas_str) ? document.getElementById(canvas_str) : uploaded_img_canvas;

    currentNote = 0;

    //console.log("canvas_ref  "+ canvas_ref.id);


    // check if the user changed the image ------------------------
    if(hasImageChanged === true)
    {
      hasImageChanged = false;
      currentNote = 0;

      startScheduler = true;
    }


    //----------------------------------------------
    // if the play button is pressed again 
    // clear the oscilator list
    try
    {
      oscilators_list.map((oscilator_node)=>
      {
        oscilator_node.stop(0);
      });

      oscilators_list.length = 0;
      currentNote = 0;

      startScheduler = true;
    }
    catch(e)
    {

    }

    
    //---------------------------------------------------------
    //---------------------------------------------------------
    // get the pixel array of the image
    let ctx = canvas_ref.getContext("2d");

    const imageData = ctx.getImageData(0, 0, canvas_ref.width, canvas_ref.height);

    const data = imageData.data;

    //resets the array after the first call
    let rgba_arr = [];
    rgba_arr.length = 0;
    
    // in this step we iterate through the array
    // and we get the rgb blocks of every pixel
    // each pixel is 4 positions in the data array
    // (rgba) a small 250 x 250 image has 62,500 pixels
    // if we turn that into sound there will be
    // 62,500 notes on the image, that is a lot to hear
    // but you can tweak the code all that you want 
    for(var i = 0, len = data.length; i < len; i += 1)
    {
      let temp_pixel = [data[i],data[i + 1],data[i + 2]];
      rgba_arr.push(temp_pixel);
    }
    
    //console.log("rgba_arr.length   " +rgba_arr.length);


    // this scheduler part is taken and modified
    // from a mdn article that is based on someone else's article
    // links will be provided in the readme
    let timerID;
    let duration = 0.7;
    let gain_value = 0.7;
    let tempo = 369.0;

    let lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
    let scheduleAheadTime = duration; // How far ahead to schedule audio (sec);

    let nextNoteTime = 0.0; // when the next note is due.


    
    // set the audio nodes for the output sound
    //---------------------------------------------------------
    //---------------------------------------------------------
    let oscillatorNode = audioCtx.createOscillator();
    oscillatorNode.type = "sine";
    oscillatorNode.start(0);
    oscilators_list.push(oscillatorNode);
    
    //---------------------------------------------------------
    //---------------------------------------------------------
    let gainNode = audioCtx.createGain();
    
    
    //---------------------------------------------------------
    //---------------------------------------------------------
    let compressor = audioCtx.createDynamicsCompressor();
    
    //---------------------------------------------------------
    //---------------------------------------------------------
    let biquadFilter = audioCtx.createBiquadFilter();
    biquadFilter.type = "bandpass";
    


    //------------------------------------------------------
    //------------------------------------------------------
    const playNote = (rgb_color)=>
    {

      //convert the rgb values in valid
      // frecuencies distributed
      // in a certain range
      // check the link in the post
      //  for the complete frecuency table

      let img_r;
      let img_g;
      let img_b; 
      let isWhite = false;

      // if it's white, make silence
      if((rgb_color[0] === 255) && 
        (rgb_color[1]  === 255) && 
        (rgb_color[2]  === 255))
      {
        img_r = 0;
        img_g = 0;
        img_b = 0;
        isWhite = true;
      }
      else
      {
        img_r =  Math.floor((rgb_color[0] * 5.475));
        img_g =  Math.floor((rgb_color[1] * 5.475));
        img_b =  Math.floor((rgb_color[2] * 5.475));
      }


      //the most simple approach
      let rgb_frequency = img_r + img_g + img_b;


      //put the min and max frecuency
      // for an rgb combination
      if((rgb_frequency === 0) && (isWhite === false))
      {
        rgb_frequency = noteValues["E4"];
      }
      else if(rgb_frequency > 4186)
      {
        rgb_frequency = noteValues["C8"];
      }
      
      //set the frequency on the oscilator
      oscillatorNode.frequency.value = rgb_frequency;

      gainNode.gain.exponentialRampToValueAtTime(gain_value, audioCtx.currentTime + duration);
      gainNode.gain.setTargetAtTime(1/1000, audioCtx.currentTime + duration , 0.02);

      compressor.threshold.setValueAtTime(-100, audioCtx.currentTime);
      compressor.knee.setValueAtTime(40, audioCtx.currentTime);
      compressor.ratio.setValueAtTime(20, audioCtx.currentTime);
      compressor.attack.setValueAtTime(0, audioCtx.currentTime);
      compressor.release.setValueAtTime(0.25, audioCtx.currentTime);
      
      biquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
      biquadFilter.gain.setValueAtTime(gain_value * 1.5, audioCtx.currentTime);
      
      
      oscillatorNode.connect(biquadFilter);
      biquadFilter.connect(gainNode);
      gainNode.connect(compressor);
      compressor.connect(audioCtx.destination);
      
      oscillatorNode.stop(audioCtx.currentTime + duration);

    }


    //------------------------------------------------------
    //------------------------------------------------------
    const scheduleNote = ()=>
    {
      // push the note on the queue, even if we're not playing.
      //notesInQueue.push({ note: beatNumber, time: time });
      playNote(rgba_arr[currentNote]);
    }




    //------------------------------------------------------
    //------------------------------------------------------
    const nextNote = (arr_len)=>
    {
      const secondsPerBeat = 60.0 / tempo;

      nextNoteTime += secondsPerBeat; // Add beat length to last beat time

      // Advance the beat number, wrap to zero
      //console.log("current note : "+currentNote);

      currentNote++;

      // if we finished to play every note on the pixel array
      // or if the user changed the image stop
      if(currentNote === arr_len || hasImageChanged === true)
      {
        //console.log("timerID : "+timerID);
        window.clearTimeout(timerID);
        startScheduler = false;
        currentNote = 0;
        timerID = 0;

        oscilators_list.map((oscilator_node)=>
        {
          oscilator_node.stop(0);
        });

        oscilators_list.length = 0;

        return; 
      }
    }



    //------------------------------------------------------
    //------------------------------------------------------
    let len_rgba = rgba_arr.length;


    //--------------------------
    const scheduler = ()=>
    {
      // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
      while(nextNoteTime < audioCtx.currentTime + scheduleAheadTime )
      {
        scheduleNote();
        nextNote(len_rgba);
      }

      if(startScheduler)
      {
        timerID = window.setTimeout(scheduler, lookahead);
      }
    }


    if(startScheduler)
    {
      // begins to play the pixels in the image
      currentNote = 0;
      scheduler();
    }


  }


  btn_play_image.addEventListener("click", ()=> playImage("uploaded_img_canvas",true));


  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------


  // clears the oscilator list 
  //when the stop button is pressed 
  const stopImageSound = ()=>
  {

    if(audioCtx.state === 'running')
    {
      oscilators_list.map((oscilator_node)=>
      {
        oscilator_node.stop(0);
      });

      oscilators_list.length = 0;
      hasImageChanged = true;
    }
    else if(audioCtx.state === 'suspended')
    {
      audioCtx.resume().then(function()
      {
        oscilators_list.map((oscilator_node)=>
        {
          oscilator_node.stop(0);
        });

        oscilators_list.length = 0;
        hasImageChanged = true;
      });  

    }



  }


  // one is for the user image, 
  // the second one is for the  drawing canvas img
  btn_stop_img.addEventListener("click", stopImageSound);
  btn_stop_img2.addEventListener("click", stopImageSound);


  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------



  btn_play_canvas.addEventListener("click", ()=> playImage("draw_canvas"));



});


