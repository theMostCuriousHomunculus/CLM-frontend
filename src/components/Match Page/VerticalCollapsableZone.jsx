import React from 'react';

export default function VerticalCollapsableZone ({
  cards,
}) {
  return (
    <div className={classes.collapsableZoneContainer} style={{ transform: 'rotate(180deg)' }}>
      {cards.map((val, index, array) => array[array.length - 1 - index]).map(card => {
        return (
          <MagicCard
            cardData={card}
            key={card._id}
            rightClickFunction={(event) => {
              event.preventDefault();
              setRightClickedCard({
                _id: card._id,
                anchorElement: event.currentTarget,
                controller: card.controller._id,
                origin: 'graveyard',
                owner: card.owner._id,
                visibility: card.visibility
              });
            }}
            style={notInPlay}
          />
        );
      })}
      <div style={{ alignItems: 'flex-end', bottom: 0, display: 'flex', flexGrow: 1, position: 'sticky' }}>
        <MUITooltip title="Graveyard">
          <MUIBadge badgeContent={topPlayer.graveyard.length} className={classes.zoneBadge} color='primary' showZero>
            <MUISvgIcon style={{ backgroundColor: '#888', borderRadius: '100%', bottom: 4, height: 32, left: 4, padding: 4, position: 'absolute', width: 32 }}>
              <GraveyardSymbol />
            </MUISvgIcon>
          </MUIBadge>
        </MUITooltip>
      </div>
    </div>
  );
};