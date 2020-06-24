export const useCardOrganizer = () => {

    function groupAndSort (cards, groupCriteria, sortCriteria) {

        const PROPERTIES_MAP = new Map ();
        PROPERTIES_MAP.set('cmc', ['cost', getCost]);
        PROPERTIES_MAP.set('color_identity', ['color', getColor]);
        PROPERTIES_MAP.set('type_line', ['type', getType]);

        const groupAndSortCriteria = new Set([...groupCriteria, ...sortCriteria]);
        groupAndSortCriteria.delete('name');

        cards.forEach(function (card) {
            for (let criteria of [...groupAndSortCriteria]) {
                card[PROPERTIES_MAP.get(criteria)[0]] = PROPERTIES_MAP.get(criteria)[1] (card);
            }
        });

        const sortedCards = masterSort(cards, sortCriteria);
        const groupedCards = masterGroup(sortedCards, groupCriteria);

        return groupedCards;

    }

    function getCost (card) {

        function Cost (name, order) {
            this.name = name;
            this.order = order;
        }

        const COST_MAP = new Map ([
            [0, new Cost("0", 1)],
            [1, new Cost("1", 2)],
            [2, new Cost("2", 3)],
            [3, new Cost("3", 4)],
            [4, new Cost("4", 5)],
            [5, new Cost("5", 6)],
            [6, new Cost("6", 7)],
            [7, new Cost("7+", 8)],
            [8, new Cost("7+", 8)],
            [9, new Cost("7+", 8)],
            [10, new Cost("7+", 8)],
            [11, new Cost("7+", 8)],
            [12, new Cost("7+", 8)],
            [13, new Cost("7+", 8)],
            [14, new Cost("7+", 8)],
            [15, new Cost("7+", 8)],
            [16, new Cost("7+", 8)]
        ]);

        const cost = COST_MAP.get(card.cmc);

        return cost;
    }

    function getColor (card) {

        function Color (name, order) {
            this.name = name;
            this.order = order;
        }

        const COLOR_MAP = new Map ([
            ["W", new Color("White", 1)],
            ["U", new Color("Blue", 2)],
            ["B", new Color("Black", 3)],
            ["R", new Color("Red", 4)],
            ["G", new Color("Green", 5)],
            ["", new Color("Colorless", 6)],
            ["U,W", new Color("Azorius", 7)],
            ["R,W", new Color("Boros", 8)],
            ["B,U", new Color("Dimir", 9)],
            ["B,G", new Color("Golgari", 10)],
            ["G,R", new Color("Gruul", 11)],
            ["R,U", new Color("Izzet", 12)],
            ["B,W", new Color("Orzhov", 13)],
            ["B,R", new Color("Rakdos", 14)],
            ["G,W", new Color("Selesnya", 15)],
            ["G,U", new Color("Simic", 16)],
            ["B,G,W", new Color("Abzan", 17)],
            ["G,U,W", new Color("Bant", 18)],
            ["B,U,W", new Color("Esper", 19)],
            ["B,R,U", new Color("Grixis", 20)],
            ["R,U,W", new Color("Jeskai", 21)],
            ["B,G,R", new Color("Jund", 22)],
            ["B,R,W", new Color("Mardu", 23)],
            ["G,R,W", new Color("Naya", 24)],
            ["B,G,U", new Color("Sultai", 25)],
            ["G,R,U", new Color("Temur", 26)],
            ["B,R,U,W", new Color("WUBR", 27)],
            ["B,G,U,W", new Color("WUBG", 28)],
            ["G,R,U,W", new Color("WURG", 29)],
            ["B,G,R,W", new Color("WBRG", 30)],
            ["B,G,R,U", new Color("UBRG", 31)],
            ["B,G,R,U,W", new Color("WUBRG", 32)]
        ]);

        const color = COLOR_MAP.get(card.color_identity.toString());

        return color;

    }

    function getType (card) {

        function Type (name, order) {
            this.name = name;
            this.order = order;
        }

        const TYPE_MAP = new Map ([
            ["Creature", new Type("Creature", 1)],
            ["Planeswalker", new Type("Planeswalker", 2)],
            ["Instant", new Type("Instant", 3)],
            ["Sorcery", new Type("Sorcery", 4)],
            ["Enchantment", new Type("Enchantment", 5)],
            ["Artifact", new Type("Artifact", 6)],
            ["Land", new Type("Land", 7)]
        ])

        let cardType = card.type_line.split(" — ")[0].replace("Legendary ", "");

        if (cardType.includes("Creature")) {
            cardType = "Creature";
        } else if (cardType.includes("Planeswalker")) {
            cardType = "Planeswalker";
        } else if (cardType.includes("Instant")) {
            cardType = "Instant";
        } else if (cardType.includes("Sorcery")) {
            cardType = "Sorcery";
        } else if (cardType.includes("Enchantment")) {
            cardType = "Enchantment";
        } else if (cardType.includes("Artifact")) {
            cardType = "Artifact";
        } else {
            cardType = "Land";
        }

        const type = TYPE_MAP.get(cardType);

        return type;
    }

    function masterGroup (cards, groupCriteria) {

        const GROUP_MAP = new Map ();
        GROUP_MAP.set('cmc', 'cost');
        GROUP_MAP.set('color_identity', 'color');
        GROUP_MAP.set('type_line', 'type');

        let groups = [];
        cards.forEach(function (card) {
            let existingGroupIndex;
            if (groups.length === 0) {
                existingGroupIndex = -1;
            } else {
                existingGroupIndex = groups.findIndex(function (group) {
                    return groupCriteria.every(function (criteria) {
                        return card[GROUP_MAP.get(criteria)]['name'] === group[GROUP_MAP.get(criteria)]['name'];
                    });
                });
            }
            if (existingGroupIndex !== -1) {
                groups[existingGroupIndex].cards.push(card);
            } else {
                let newGroup = {};
                for (let criteria of groupCriteria) {
                    newGroup[GROUP_MAP.get(criteria)] = card[GROUP_MAP.get(criteria)];
                }
                newGroup.cards = [];
                newGroup.cards.push(card);
                groups.push(newGroup);
            }
        });
        
        return groups;

    }

    function masterSort (cards, sortCriteria) {

        const SORT_MAP = new Map ();
        SORT_MAP.set('cmc', sortByCMC);
        SORT_MAP.set('color_identity', sortByColor);
        SORT_MAP.set('name', sortByName);
        SORT_MAP.set('type_line', sortByType);

        cards.sort(function (a, b) {
            for (let criteria of sortCriteria) {
                if (SORT_MAP.get(criteria) (a, b) === 1) {
                    return 1;
                } else if (SORT_MAP.get(criteria) (a, b) === -1) {
                    return -1;
                }
            }
            return 0;
        });

        return cards;

    }

    function sortByCMC (a, b) {
        if (a.cost.order < b.cost.order) {
            return -1;
        } else if (a.cost.order > b.cost.order) {
            return 1;
        }
    }

    function sortByColor (a, b) {
        if (a.color.order < b.color.order) {
            return -1;
        } else if (a.color.order > b.color.order) {
            return 1;
        }
    }

    function sortByName (a, b) {
        if (a.name < b.name) {
            return -1;
        } else if (a.name > b.name) {
            return 1;
        }
    }

    function sortByType (a, b) {
        if (a.type.order < b.type.order) {
            return -1;
        } else if (a.type.order > b.type.order) {
            return 1;
        }
    }

    return { groupAndSort };
}