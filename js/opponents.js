const skeleton = {
    name: 'Skeleton',
    image: "skeleton.png",
    maxHealth: 120,
    damage: 30,
    criticalChance: 0.2,
    attackCount: 1,
    defenseCount: 2,

}
const spider = {
    name: 'Spider',
    image: "spider.png",
    maxHealth: 75,
    damage: 25,
    criticalChance: 0.4,
    attackCount: 2,
    defenseCount: 1,
}
const troll = {
    name: 'Troll',
    image: "troll.png",
    maxHealth: 150,
    damage: 35,
    criticalChance: 0.1,
    attackCount: 1,
    defenseCount: 3,
}
export const opponents = [skeleton, spider, troll]