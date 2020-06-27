import React from 'react';

const TableView = (props) => {

  const monoColors = ["White", "Blue", "Black", "Red", "Green", "Colorless"];
  const multiColors = ["Azorius", "Boros", "Dimir", "Golgari", "Gruul", "Izzet", "Orzhov", "Rakdos", "Selesnya", "Simic", "Abzan", "Bant", "Esper", "Grixis", "Jeskai", "Jund", "Mardu", "Naya", "Sultai", "Temur", "WUBR", "WUBG", "WURG", "WBRG", "UBRG", "WUBRG"];
  const types = ["Creature", "Planeswalker", "Instant", "Sorcery", "Enchantment", "Artifact", "Land", "???"];
  const costs = ["0", "1", "2", "3", "4", "5", "6", "7+"];

  return (
    <div className="table-view-main-container">
      {monoColors.map(function (color) {
        const cards_color = props.componentState.displayed_cards.filter(function (card) {
          return card.color === color;
        });
        return (
          <div className={`table-view-color-container ${color.toLowerCase}-card-container`} key={`table-${color}`}>
            <h3>{color}</h3>
            {types.map(function (type) {
              const cards_color_type = cards_color.filter(function (card) {
                return card.type === type;
              });
              return (
                <React.Fragment key={type}>
                  {cards_color_type.length > 0 &&
                    <div>
                      <h4>{type}</h4>
                      {costs.map(function (cost) {
                        const cards_color_type_cost = cards_color_type.filter(function (card) {
                          return card.cost === cost;
                        });
                        return (
                          <div key={cost}>
                            {cards_color_type_cost.map(function (card) {
                              return (
                                <div
                                  back_image={card.back_image}
                                  image={card.image}
                                  key={card._id}
                                  onMouseOut={props.hidePreview}
                                  onMouseOver={props.showPreview}
                                >
                                  {card.name}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  }
                </React.Fragment>
              );
            })}
          </div>
        );
      })}
      <div className="table-view-color-container multicolor-card-container">
        {multiColors.map(function (color) {
          const cards_color = props.componentState.displayed_cards.filter(function (card) {
            return card.color === color;
          });
          return (
            <div  key={color}>
              <h3>{color}</h3>
              {[true, false].map(function (isCreature) {
                const cards_color_isCreature = cards_color.filter(function (card) {
                  return isCreature ? card.type === "Creature" : card.type !== "Creature";
                });
                return (
                  <div key={isCreature ? "a" : "b"}>
                    <h4>{isCreature ? "Creature" : "Non-Creature"}</h4>
                    {costs.map(function (cost) {
                      const cards_color_isCreature_cost = cards_color_isCreature.filter(function (card) {
                        return card.cost === cost;
                      });
                      return (
                        <div key={cost}>
                          {cards_color_isCreature_cost.map(function (card) {
                            return (
                              <div
                                back_image={card.back_image}
                                image={card.image}
                                key={card._id}
                                onMouseOut={props.hidePreview}
                                onMouseOver={props.showPreview}
                              >
                                {card.name}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TableView;