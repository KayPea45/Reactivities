export interface Capybara {
    name: string;
    numLegs: number;
    makeSound: (sound: string) => void;
}

const Capy1 : Capybara = {
    name: "Jenny",
    numLegs: 4,
    makeSound: (sound: string) => console.log(sound)
}

const Capy2 : Capybara = {
    name: "Arietta",
    numLegs: 4,
    makeSound: (sound: string) => console.log(sound)
}

Capy1.makeSound("squeek")
Capy2.makeSound("roawrr")

export const capybaras = [Capy1, Capy2]