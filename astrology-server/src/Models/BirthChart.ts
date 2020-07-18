import { Sign } from "./Sign"
import { House } from "./House"

export class BirthChart {
    profileId: number //primary key
    sun: Sign //not null
    moon: Sign //not null
    mercury: Sign //not null
    venus: Sign //not null
    mars: Sign //not null
    jupiter: Sign //not null
    saturn: Sign //not null
    uranus: Sign //not null
    neptune: Sign //not null
    pluto: Sign //not null
    node: Sign //not null
    lilith: Sign //not null
    chiron: Sign //not null
    houses: House //not null
}