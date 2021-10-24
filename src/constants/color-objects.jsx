import React from 'react';

import { ReactComponent as ManaSymbolW } from '../svgs/W-mana-symbol.svg';
import { ReactComponent as ManaSymbolU } from '../svgs/U-mana-symbol.svg';
import { ReactComponent as ManaSymbolB } from '../svgs/B-mana-symbol.svg';
import { ReactComponent as ManaSymbolR } from '../svgs/R-mana-symbol.svg';
import { ReactComponent as ManaSymbolG } from '../svgs/G-mana-symbol.svg';
import { ReactComponent as ManaSymbolC } from '../svgs/C-mana-symbol.svg';
import { ReactComponent as ManaSymbolBG } from '../svgs/BG-mana-symbol.svg';
import { ReactComponent as ManaSymbolBR } from '../svgs/BR-mana-symbol.svg';
import { ReactComponent as ManaSymbolGU } from '../svgs/GU-mana-symbol.svg';
import { ReactComponent as ManaSymbolGW } from '../svgs/GW-mana-symbol.svg';
import { ReactComponent as ManaSymbolRG } from '../svgs/RG-mana-symbol.svg';
import { ReactComponent as ManaSymbolRW } from '../svgs/RW-mana-symbol.svg';
import { ReactComponent as ManaSymbolUB } from '../svgs/UB-mana-symbol.svg';
import { ReactComponent as ManaSymbolUR } from '../svgs/UR-mana-symbol.svg';
import { ReactComponent as ManaSymbolWB } from '../svgs/WB-mana-symbol.svg';
import { ReactComponent as ManaSymbolWU } from '../svgs/WU-mana-symbol.svg';

const monoColors = [
  {
    color_identity: "W",
    hex: "#fffbd5",
    name: "White",
    svg: <ManaSymbolW />
  },
  {
    color_identity: "U",
    hex: "#aae0fa",
    name: "Blue",
    svg: <ManaSymbolU />
  },
  {
    color_identity: "B",
    hex: "#cbc2bf",
    name: "Black",
    svg: <ManaSymbolB />
  },
  {
    color_identity: "R",
    hex: "#f9aa8f",
    name: "Red",
    svg: <ManaSymbolR />
  },
  {
    color_identity: "G",
    hex: "#9bd3ae",
    name: "Green",
    svg: <ManaSymbolG />
  },
  {
    color_identity: "",
    hex: "#e5e7e9",
    name: "Colorless",
    svg: <ManaSymbolC />
  }
];

const multiColors = [
  {
    color_identity: "U,W",
    name: "Azorius",
    svg: <ManaSymbolWU />
  },
  {
    color_identity: "R,W",
    name: "Boros",
    svg: <ManaSymbolRW />
  },
  {
    color_identity: "B,U",
    name: "Dimir",
    svg: <ManaSymbolUB />
  },
  {
    color_identity: "B,G",
    name: "Golgari",
    svg: <ManaSymbolBG />
  },
  {
    color_identity: "G,R",
    name: "Gruul",
    svg: <ManaSymbolRG />
  },
  {
    color_identity: "R,U",
    name: "Izzet",
    svg: <ManaSymbolUR />
  },
  {
    color_identity: "B,W",
    name: "Orzhov",
    svg: <ManaSymbolWB />
  },
  {
    color_identity: "B,R",
    name: "Rakdos",
    svg: <ManaSymbolBR />
  },
  {
    color_identity: "G,W",
    name: "Selesnya",
    svg: <ManaSymbolGW />
  },
  {
    color_identity: "G,U",
    name: "Simic",
    svg: <ManaSymbolGU />
  },
  {
    color_identity: "B,G,W",
    name: "Abzan"
  },
  {
    color_identity: "G,U,W",
    name: "Bant"
  },
  {
    color_identity: "B,U,W",
    name: "Esper"
  },
  {
    color_identity: "B,R,U",
    name: "Grixis"
  },
  {
    color_identity: "R,U,W",
    name: "Jeskai"
  },
  {
    color_identity: "B,G,R",
    name: "Jund"
  },
  {
    color_identity: "B,R,W",
    name: "Mardu"
  },
  {
    color_identity: "G,R,W",
    name: "Naya"
  },
  {
    color_identity: "B,G,U",
    name: "Sultai"
  },
  {
    color_identity: "G,R,U",
    name: "Temur"
  },
  {
    color_identity: "B,R,U,W",
    name: "WUBR"
  },
  {
    color_identity: "B,G,U,W",
    name: "WUBG"
  },
  {
    color_identity: "G,R,U,W",
    name: "WURG"
  },
  {
    color_identity: "B,G,R,W",
    name: "WBRG"
  },
  {
    color_identity: "B,G,R,U",
    name: "UBRG"
  },
  {
    color_identity: "B,G,R,U,W",
    name: "WUBRG"
  }
];

export {
  monoColors,
  multiColors
};