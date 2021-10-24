import React from 'react';

import { ReactComponent as CreatureSVG } from '../svgs/iko.svg';
import { ReactComponent as PlaneswalkerSVG } from '../svgs/planeswalker.svg';
import { ReactComponent as InstantSVG } from '../svgs/tsr.svg';
import { ReactComponent as SorcerySVG } from '../svgs/mor.svg';
import { ReactComponent as EnchantmentSVG } from '../svgs/ori.svg';
import { ReactComponent as ArtifactSVG } from '../svgs/mrd.svg';
import { ReactComponent as LandSVG } from '../svgs/gs1.svg';
import { ReactComponent as NonCreatureSVG } from '../svgs/jmp.svg';

const generalCardTypes = [
  {
    name: "Creature",
    svg: <CreatureSVG />
  }, {
    name: "Non-Creature",
    svg: <NonCreatureSVG />
  }, {
    name: "Land",
    svg: <LandSVG />
  }
];

const specificCardTypes = [
  {
    name: "Creature",
    svg: <CreatureSVG />
  }, {
    name: "Planeswalker",
    svg: <PlaneswalkerSVG />
  }, {
    name: "Instant",
    svg: <InstantSVG />
  }, {
    name: "Sorcery",
    svg: <SorcerySVG />
  }, {
    name: "Enchantment",
    svg: <EnchantmentSVG />
  }, {
    name: "Artifact",
    svg: <ArtifactSVG />
  }, {
    name: "Land",
    svg: <LandSVG />
  }
];

export {
  generalCardTypes,
  specificCardTypes
};