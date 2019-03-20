var ctx;
PImage lastFrame;
int i,j;
int nb=20;
// Size of pixelated camera pixel
int pixelsize = 0;
int pixelate = 80; 
int columns, rows = 0;
color pix;

void setup(){
  size(640,480);
  ctx = externals.context;
  smooth();
  background(0);
  pixelsize = setAspectRatio(pixelate); // adapt pixelsize for 4:3, 16:9 and resolution
  lastFrame = new PImage(video.width, video.height);
}

void draw(){
  pushMatrix();
  ctx.drawImage(video, 0, 0, width, height); //video is defined inside getUserMedia.js
  popMatrix();
  //grab frame
  lastFrame=get();
  
  // Hide camera
  rect(0, 0, width, height);

  // Loop through all pixels, skip pixel offset along the y-axis
  for (int y = 0; y < lastFrame.height; y+=pixelsize) {
    // skip pixel offset along the x-axis
    for (int x = 0; x < lastFrame.width; x+=pixelsize) {
      // Calculate the 1D location from a 2D grid
      int loc = x + y*lastFrame.width;
      float newx = constrain(x + random(- pixelate, pixelate), 0, width);   
      float newy = constrain(y + random(- pixelate, pixelate), 0, height);
      pix = lastFrame.pixels[loc];
      // Color according to the image
      stroke(pix);
      fill(pix);
      switch(getType()) {
        case 'Sliced':
          float r = red (lastFrame.pixels[loc]);
          float g = green (lastFrame.pixels[loc]);
          float b = blue (lastFrame.pixels[loc]);
          float av = constrain((r+g+b), 0, 255);
          strokeWeight(1);
          pushMatrix();
          translate(x,y);
          //stroke(r,g,b);
          if (x % 2 == 0) {
            line(newx-x, 0, newx-av, 0); 
          } else {
            line(-newx+x, 0, newx+av, 0); 
          }
          popMatrix(); 
          break;
        case 'Lines': 
          strokeWeight(1);  
          line(x, y, newx, newy);
          break;
        case 'Rectangles': 
          strokeWeight(5);  
          line(x, y, newx, newy);
          break;
        default:             // Default executes if the case labels
          drawLines(1);  
          break;
      }
    }
  }
  switch(getFilter()) {
    case 'None': 
      break;
    case 'Gray':
      filter(GRAY);
      break;
    case 'Invert':
      filter(INVERT);
      break;
    case 'Posterize': 
      filter(POSTERIZE, 4);
      break;
    case 'Opaque':
      filter(OPAQUE);
      break;
    case 'Blur':
      filter(BLUR);
      break;
    case 'Erode':
      filter(ERODE);
      break;
    case 'Dilate':
      filter(DILATE);
      break;
    case 'Blank and White':
      filter(THRESHOLD);
      break;
    default:             // Default executes if the case labels
      break;
  }
}

// calculate aspect ration
int setAspectRatio(int pixelate) {
  int ggt =  gCD(width, height);
  return ggt / pixelate;
}

// common divisor
int gCD(int a, int b) {
  int h;
  while (b != 0) {
    h = a % b;
    a = b;
    b = h;
  }
  return a;
}

color complement(color original) {
  float R = red(original);
  float G = green(original);
  float B = blue(original);
  float minRGB = min(R,min(G,B));
  float maxRGB = max(R,max(G,B));
  float minPlusMax = minRGB + maxRGB;
  color complement = color(minPlusMax-R, minPlusMax-G, minPlusMax-B);
  return complement;
}