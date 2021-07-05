import React from 'react';

import { ReactComponent as ManaSymbol0 } from '../../svgs/0-mana-symbol.svg';
import { ReactComponent as ManaSymbol1 } from '../../svgs/1-mana-symbol.svg';
import { ReactComponent as ManaSymbol2 } from '../../svgs/2-mana-symbol.svg';
import { ReactComponent as ManaSymbol3 } from '../../svgs/3-mana-symbol.svg';
import { ReactComponent as ManaSymbol4 } from '../../svgs/4-mana-symbol.svg';
import { ReactComponent as ManaSymbol5 } from '../../svgs/5-mana-symbol.svg';
import { ReactComponent as ManaSymbol6 } from '../../svgs/6-mana-symbol.svg';
import { ReactComponent as ManaSymbol7 } from '../../svgs/7-mana-symbol.svg';
import { ReactComponent as ManaSymbol8 } from '../../svgs/8-mana-symbol.svg';
import { ReactComponent as ManaSymbol9 } from '../../svgs/9-mana-symbol.svg';
import { ReactComponent as ManaSymbol10 } from '../../svgs/10-mana-symbol.svg';
import { ReactComponent as ManaSymbol11 } from '../../svgs/11-mana-symbol.svg';
import { ReactComponent as ManaSymbol12 } from '../../svgs/12-mana-symbol.svg';
import { ReactComponent as ManaSymbol13 } from '../../svgs/13-mana-symbol.svg';
import { ReactComponent as ManaSymbol14 } from '../../svgs/14-mana-symbol.svg';
import { ReactComponent as ManaSymbol15 } from '../../svgs/15-mana-symbol.svg';
import { ReactComponent as ManaSymbol16 } from '../../svgs/16-mana-symbol.svg';
import { ReactComponent as ManaSymbolW } from '../../svgs/W-mana-symbol.svg';
import { ReactComponent as ManaSymbolU } from '../../svgs/U-mana-symbol.svg';
import { ReactComponent as ManaSymbolB } from '../../svgs/B-mana-symbol.svg';
import { ReactComponent as ManaSymbolR } from '../../svgs/R-mana-symbol.svg';
import { ReactComponent as ManaSymbolG } from '../../svgs/G-mana-symbol.svg';
import { ReactComponent as ManaSymbolC } from '../../svgs/C-mana-symbol.svg';
import { ReactComponent as ManaSymbol2W } from '../../svgs/2W-mana-symbol.svg';
import { ReactComponent as ManaSymbol2U } from '../../svgs/2U-mana-symbol.svg';
import { ReactComponent as ManaSymbol2B } from '../../svgs/2B-mana-symbol.svg';
import { ReactComponent as ManaSymbol2R } from '../../svgs/2R-mana-symbol.svg';
import { ReactComponent as ManaSymbol2G } from '../../svgs/2G-mana-symbol.svg';
import { ReactComponent as ManaSymbolBG } from '../../svgs/BG-mana-symbol.svg';
import { ReactComponent as ManaSymbolBR } from '../../svgs/BR-mana-symbol.svg';
import { ReactComponent as ManaSymbolBP } from '../../svgs/BP-mana-symbol.svg';
import { ReactComponent as ManaSymbolGU } from '../../svgs/GU-mana-symbol.svg';
import { ReactComponent as ManaSymbolGW } from '../../svgs/GW-mana-symbol.svg';
import { ReactComponent as ManaSymbolGP } from '../../svgs/GP-mana-symbol.svg';
import { ReactComponent as ManaSymbolRG } from '../../svgs/RG-mana-symbol.svg';
import { ReactComponent as ManaSymbolRW } from '../../svgs/RW-mana-symbol.svg';
import { ReactComponent as ManaSymbolRP } from '../../svgs/RP-mana-symbol.svg';
import { ReactComponent as ManaSymbolUB } from '../../svgs/UB-mana-symbol.svg';
import { ReactComponent as ManaSymbolUR } from '../../svgs/UR-mana-symbol.svg';
import { ReactComponent as ManaSymbolUP } from '../../svgs/UP-mana-symbol.svg';
import { ReactComponent as ManaSymbolWB } from '../../svgs/WB-mana-symbol.svg';
import { ReactComponent as ManaSymbolWU } from '../../svgs/WU-mana-symbol.svg';
import { ReactComponent as ManaSymbolWP } from '../../svgs/WP-mana-symbol.svg';
import { ReactComponent as ManaSymbolX } from '../../svgs/X-mana-symbol.svg';
import { ReactComponent as ManaSymbolY } from '../../svgs/Y-mana-symbol.svg';
import { ReactComponent as ManaSymbolZ } from '../../svgs/Z-mana-symbol.svg';

const manaSymbolComponents = {
  '0': <ManaSymbol0 />,
  '1': <ManaSymbol1 />,
  '2': <ManaSymbol2 />,
  '3': <ManaSymbol3 />,
  '4': <ManaSymbol4 />,
  '5': <ManaSymbol5 />,
  '6': <ManaSymbol6 />,
  '7': <ManaSymbol7 />,
  '8': <ManaSymbol8 />,
  '9': <ManaSymbol9 />,
  '10': <ManaSymbol10 />,
  '11': <ManaSymbol11 />,
  '12': <ManaSymbol12 />,
  '13': <ManaSymbol13 />,
  '14': <ManaSymbol14 />,
  '15': <ManaSymbol15 />,
  '16': <ManaSymbol16 />,
  'W': <ManaSymbolW />,
  'U': <ManaSymbolU />,
  'B': <ManaSymbolB />,
  'R': <ManaSymbolR />,
  'G': <ManaSymbolG />,
  'C': <ManaSymbolC />,
  '2W': <ManaSymbol2W />,
  '2U': <ManaSymbol2U />,
  '2B': <ManaSymbol2B />,
  '2R': <ManaSymbol2R />,
  '2G': <ManaSymbol2G />,
  'BG': <ManaSymbolBG />,
  'BR': <ManaSymbolBR />,
  'BP': <ManaSymbolBP />,
  'GU': <ManaSymbolGU />,
  'GW': <ManaSymbolGW />,
  'GP': <ManaSymbolGP />,
  'RG': <ManaSymbolRG />,
  'RW': <ManaSymbolRW />,
  'RP': <ManaSymbolRP />,
  'UB': <ManaSymbolUB />,
  'UR': <ManaSymbolUR />,
  'UP': <ManaSymbolUP />,
  'WB': <ManaSymbolWB />,
  'WU': <ManaSymbolWU />,
  'WP': <ManaSymbolWP />,
  'X': <ManaSymbolX />,
  'Y': <ManaSymbolY />,
  'Z': <ManaSymbolZ />
}

export default function ManaCostSVGs ({ manaCostString, size }) {

  const stringArray = manaCostString.split('}{');
  
  if (stringArray[0]) {
    stringArray[0] = stringArray[0].replace('{', '');
    stringArray[stringArray.length - 1] = stringArray[stringArray.length - 1].replace('}', '');

    for (let index = 0; index < stringArray.length; index++) {
      stringArray[index] = stringArray[index].replace('/', '');
    }
  } else {
    stringArray.pop();
  }

  return (
    <span style={{ display: 'inline-flex' }}>
      {stringArray.map((str, index) => React.cloneElement(manaSymbolComponents[str],
        { key: index, style: { height: size, width: size } }))
      }
    </span>
  );
};