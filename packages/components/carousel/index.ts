import {App} from 'vue'
import  {componentInstall}    from "../../libs/utils"
import carousel from "./src/carousel.vue"
import carouselItem from "./src/carousel-item.vue"


export const AriCarousel = componentInstall(carousel,{
    carouselItem
})

export default AriCarousel

export const AriCarouselItem = componentInstall(carouselItem)