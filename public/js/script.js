document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("animeek-module2-project JS imported successfully!");
  },
  false
);


//-----index page slider-----//
var myCarousel = document.querySelector('#myCarousel')
var carousel = new bootstrap.Carousel(myCarousel)

// Instantiate a slider
var mySlider = new Slider("input.slider", {
	// initial options object
});

// Call a method on the slider
var value = mySlider.getValue();

// For non-getter methods, you can chain together commands
mySlider
	.setValue(5)
	.setValue(7);