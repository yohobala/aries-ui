import {App} from 'vue'
import carousel from "./src/carousel.vue"
import carouselItem from "./src/carousel-item.vue"
import  {componentInstall}    from "aries-ui/libs"

export const AriCarousel = componentInstall(carousel,{
    carouselItem
})

export default AriCarousel

export const AriCarouselItem = componentInstall(carouselItem)