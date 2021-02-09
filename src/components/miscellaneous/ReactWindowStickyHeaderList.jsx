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

const ReactWindowStickyHeaderList = ({ children, itemSize, headerRow, headerRowSize, ...rest }) => {

  const classes = useStyles();
  
  const HeaderRow = ({ style }) => (
    <div className={classes.sticky} style={style}>
      {headerRow}
    </div>
  );

  const ItemWrapper = ({ data, index, style }) => {
    const { ItemRenderer } = data;
    return <ItemRenderer index={index} style={{ ...style, top: `${(index * itemSize) + headerRowSize}px` }} />;
  }
  
  const innerElementType = React.forwardRef(({ children, ...rest }, ref) => (
    <StickyListContext.Consumer>
      {() => (
        <div ref={ref} {...rest}>
          <HeaderRow
            style={{ top: 0, left: 0, height: headerRowSize }}
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