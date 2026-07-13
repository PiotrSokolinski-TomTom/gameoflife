import {
  Box,
  Button,
  Checkbox,
  Divider,
  Drawer,
  Slider,
  TextField,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import * as React from "react";
import styled from "styled-components";
import { PatternLibrary } from "./PatternLibrary";
import type { Pattern } from "../types/pattern";

const StyledButton = styled(Button)`
  width: 64px;
  height: 64px;
  color: #ffffff;
  position: absolute;
  top: 12px;
  left: 12px;
  border: 2px solid gray;
  background: #000000;
  border-radius: 12px;

  &:hover {
    background: #333333;
  }
`;

const StyledBox = styled(Box)`
  background: #000000;
`;

const DrawerContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
  padding: 24px 16px;
  height: 100%;
  color: #ffffff;
`;

const SectionTitle = styled.p`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
`;

const Info = styled.p`
  font-size: 14px;
  margin: 0;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

export const MaxWRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  width: 100%;
`;

export const ActionButton = styled(Button)`
  font-family: "Courier New", Courier, monospace;
  color: #000000;
  background: #ffffff;
  font-size: 14px;
  width: 100%;
`;

const StyledTextField = styled(TextField)`
  font-family: "Courier New", Courier, monospace;
  background: #ffffff;
  color: #000000;
`;

const StyledCheckbox = styled(Checkbox)`
  background: #ffffff;
  color: #000000;
  border: 1px gray;
`;

type SideDrawerProps = {
  simSpeed: number;
  onSimSpeedChange: (value: number) => void;
  cellSize: number;
  onNext: () => void;
  autoFollowShape: boolean;
  onAutoFollowShape: (
    event: React.ChangeEvent<HTMLInputElement, Element>,
    checked: boolean,
  ) => void;
  autoResizeCanvas: boolean;
  onAutoResizeCanvas: (
    event: React.ChangeEvent<HTMLInputElement, Element>,
    checked: boolean,
  ) => void;
  onSelectPattern: (pattern: Pattern) => void;
  width: string | null;
  onWidthChange: (value: string) => void;
  height: string | null;
  onHeightChange: (value: string) => void;
  seed: string | null;
  onSeedChange: (value: string) => void;
  onRandomize: () => void;
  onClear: () => void;
};

export default function SideDrawer({
  simSpeed,
  onSimSpeedChange,
  cellSize,
  onNext,
  autoFollowShape,
  onAutoFollowShape,
  autoResizeCanvas,
  onAutoResizeCanvas,
  onSelectPattern,
  width,
  onWidthChange,
  height,
  onHeightChange,
  seed,
  onSeedChange,
  onRandomize,
  onClear,
}: SideDrawerProps) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <StyledBox sx={{ width: 500 }} role="presentation">
      <DrawerContent>
        <ActionButton
          variant="contained"
          aria-label="Close"
          onClick={toggleDrawer(false)}
        >
          Close menu <CloseIcon />
        </ActionButton>
        <SectionTitle>New board</SectionTitle>
        <Row>
          <StyledTextField
            aria-label="width"
            variant="outlined"
            size="small"
            placeholder="Width"
            value={width}
            onChange={(e) => onWidthChange(e.target.value)}
          />
          <StyledTextField
            aria-label="height"
            variant="outlined"
            size="small"
            placeholder="Height"
            value={height}
            onChange={(e) => onHeightChange(e.target.value)}
          />
          <StyledTextField
            aria-label="seed"
            variant="outlined"
            size="small"
            placeholder="Seed"
            value={seed}
            onChange={(e) => onSeedChange(e.target.value)}
          />
        </Row>
        <MaxWRow>
          <ActionButton variant="contained" onClick={onRandomize}>
            Randomize
          </ActionButton>
          <ActionButton variant="contained" onClick={onClear}>
            Clear board
          </ActionButton>
        </MaxWRow>
        <SectionTitle>Simulation</SectionTitle>
        <ActionButton variant="contained" aria-label="Next" onClick={onNext}>
          Next tick
        </ActionButton>
        <Row>
          <Info>Simulation speed</Info>
          <Slider
            sx={{ width: 200 }}
            value={simSpeed}
            onChange={(_, value) => onSimSpeedChange(value as number)}
            min={0}
            max={60}
          />
          <Info>{simSpeed} FPS</Info>
        </Row>
        <Row>
          <StyledCheckbox
            checked={autoFollowShape}
            onChange={onAutoFollowShape}
            disableRipple
          />
          <Info>Auto follow shape</Info>
        </Row>
        <Row>
          <StyledCheckbox
            checked={autoResizeCanvas}
            onChange={onAutoResizeCanvas}
            disableRipple
          />
          <Info>Auto resize canvas</Info>
        </Row>

        <Info>Cell size: {cellSize.toFixed(2)}</Info>

        <SectionTitle>Patterns</SectionTitle>
        <PatternLibrary onSelect={onSelectPattern} />
      </DrawerContent>
    </StyledBox>
  );

  return (
    <div>
      <StyledButton onClick={toggleDrawer(true)}>
        <MenuIcon />
      </StyledButton>
      <Drawer open={open} onClose={toggleDrawer(false)} variant={"persistent"}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
