import React from 'react';
import { FixedSizeList as RWFixedSizedList } from 'react-window';
import { makeStyles } from '@material-ui/core/styles';

const StickyListContext = React.createContext();
StickyListContext.displayName = 'StickyListContext';

const useStyles = makeStyles({
  sticky: {
    position: 'sticky !important',
    // position: '-webkit-sticky !important',
    zIndex: 2
  }
});

const ItemWrapper = ({ data, index, style }) => {
  const { ItemRenderer } = data;
  // if (index === 0) {
  //   return null;
  // }
  return <ItemRenderer index={index} style={{ ...style, top: `${(index + 1) * 80}px` }} />;
}

const ReactWindowStickyHeaderList = ({ children, itemSize, headerRow, ...rest }) => {

  const classes = useStyles();
  
  const HeaderRow = ({ style }) => (
    <div className={classes.sticky} style={style}>
      {headerRow}
    </div>
  );
  
  const innerElementType = React.forwardRef(({ children, ...rest }, ref) => (
    <StickyListContext.Consumer>
      {() => (
        <div ref={ref} {...rest}>
          <HeaderRow
            style={{ top: 0, left: 0, height: itemSize }}
          />
          {children}
        </div>
      )}
    </StickyListContext.Consumer>
  ));

  return (
    <StickyListContext.Provider value={{ ItemRenderer: children }}>
      <RWFixedSizedList
        innerElementType={innerElementType}
        itemData={{ ItemRenderer: children }}
        itemSize={itemSize}
        {...rest}
      >
        {ItemWrapper}
      </RWFixedSizedList>
    </StickyListContext.Provider>
  );
};

export default ReactWindowStickyHeaderList;