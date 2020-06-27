import React from 'react';

const CubeView = (props) => {

  const monoColors = ["White", "Blue", "Black", "Red", "Green", "Colorless"];
  const multiColors = ["Azorius", "Boros", "Dimir", "Golgari", "Gruul", "Izzet", "Orzhov", "Rakdos", "Selesnya", "Simic", "Abzan", "Bant", "Esper", "Grixis", "Jeskai", "Jund", "Mardu", "Naya", "Sultai", "Temur", "WUBR", "WUBG", "WURG", "WBRG", "UBRG", "WUBRG"];
  const costs = ["0", "1", "2", "3", "4", "5", "6", "7+"];

  return (
    <div className="curve-view-main-container">
      {[...monoColors, ...multiColors].map(function (color) {
        const cards_color = props.componentState.displayed_cards.filter(function (card) {
          return card.color === color;
        });
        return (
          <div className={`curve-view-color-container ${color.toLowerCase}-card-container`} key={`curve-${color}`}>
            <h3>{color}</h3>
            {[true, false].map(function (isCreature) {
              const cards_color_isCreature = cards_color.filter(function (card) {
                return isCreature ? card.type === "Creature" : card.type !== "Creature";
              });
              return (
                <React.Fragment key={isCreature ? "a" : "b"}>
                  <h4>{isCreature ? "Creature" : "Non-Creature"}</h4>
                  <div className="curve-view-type-container">
                    {costs.map(function (cost) {
                      const cards_color_isCreature_cost = cards_color_isCreature.filter(function (card) {
                        return card.cost === cost;
                      });
                      return (
                        <div key={cost}>
                          <h5>{cost} CMC</h5>
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
                </React.Fragment>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default CubeView;