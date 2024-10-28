import React, {useEffect, useState} from 'react';
import {Box, createTheme, Menu, MenuItem, ThemeProvider} from "@mui/material";

const DARK_THEME = createTheme({
  palette: {
    mode: "dark",
  },
})

const CELL_WIDTH = 72;
const CELL_HEIGHT = 48;
const BORDER = 2;
const TOWER_ICON_SIZE = 40;
const ENEMY_ICON_SIZE = 24;
const FONT_SIZE = 1.0;

const LEVELS = new Map([
  ["1.1",    "101000000000"],
  ["1.2",    "101000000000"],
  ["1.3",    "101000000000"],
  ["1.4",    "101000000000"],
  ["1.5",    "111000000000"],
  ["1.6",    "111000000000"],
  ["1.7",    "111000000000"],
  ["1.8",    "111000000001"],
  ["1.b1",   "111000000000"],
  ["2.1",    "111000000000"],
  ["2.2",    "110100000000"],
  ["2.3",    "110100000000"],
  ["2.4",    "101100000000"],
  ["2.5",    "111000000000"],
  ["2.6",    "111000000000"],
  ["2.7",    "111100000000"],
  ["2.8",    "111010000001"],
  ["2.b1",   "111100000000"],
  ["3.1",    "101110000000"],
  ["3.2",    "111001000000"],
  ["3.3",    "101011000000"],
  ["3.4",    "110011000000"],
  ["3.5",    "111011000000"],
  ["3.6",    "101001100000"],
  ["3.7",    "110010100000"],
  ["3.8",    "111001100001"],
  ["3.b1",   "101010100100"],
  ["4.1",    "111101000000"],
  ["4.2",    "101111000000"],
  ["4.3",    "111101110000"],
  ["4.4",    "111111100000"],
  ["4.5",    "111001110000"],
  ["4.6",    "111001110000"],
  ["4.7",    "110110011000"],
  ["4.8",    "100111101001"],
  ["4.b1",   "111100101010"],
  ["5.1",    "111111111000"],
  ["5.2",    "010010111100"],
  ["5.3",    "111001100100"],
  ["5.4",    "111110010100"],
  ["5.5",    "110001111100"],
  ["5.6",    "011111101010"],
  ["5.7",    "111001101110"],
  ["5.8",    "111111111111"],
  ["5.b1",   "111111110001"],
  ["5.b2",   "111111111101"],
  ["6.1",    "111111111111"],
  ["6.2",    "101111111010"],
  ["6.3",    "000000000001"],
  ["6.4",    "101000011101"],
  ["6.5",    "111111111101"],
  ["6.6",    "101110111111"],
  ["rumble", "111111101011"],
  ["dev",    "111111111111"],
]);

const TOWERS = [
  "basic",
  "sniper",
  "cannon",
  "freezing",
  "air",
  "splash",
  "blast",
  "multishot",
  "minigun",
  "venom",
  "tesla",
  "missile",
  "flamethrower",
  "laser",
  "gauss",
  "crusher",
];

const ENEMIES = [
  "regular",
  "fast",
  "strong",
  "heli",
  "jet",
  "armored",
  "healer",
  "toxic",
  "icy",
  "fighter",
  "light",
  "boss",
];

const EFFECTIVENESS = [
  [150, 100,  50,   0,   0,  25,  25, 150,  50,  25, 100, 100],
  [100,  25, 150,   0,   0, 100, 100,  50,  25, 150,  25, 100],
  [100, 150,  25,   0,   0,  50, 100, 100, 150,  50,  50, 100],
  [100, 100, 100, 100,   0,  50, 100, 100,  50, 100, 100, 100],
  [  0,   0,   0, 150, 100,   0,   0,   0,   0,   0,   0, 100],
  [ 10, 100,  50,  50,  50,  25,  50, 150, 150, 150, 100, 100],
  [100,  50,  25,   0,   0, 150,  50,  25,  25,  50,  25, 100],
  [100, 150,   0, 100,  50,  25,  25, 100, 100,  50, 150, 100],
  [100,  50,  50, 100,  50, 150, 150,  50,  25,   0,  25, 100],
  [150, 150, 100,   0,   0, 150, 100,   0,  50,  50, 100, 100],
  [100,  25, 150,  50, 150,   0, 100, 100,  25,   0,  50, 100],
  [ 50,   0, 150, 150,  50,  50, 100,  50, 150,  50, 150, 100],
  [ 75, 100,  50,   0,   0,  25,   0, 150, 150, 150, 100, 100],
  [100, 100, 100, 100, 150, 100, 150,  50,   0, 100,  25, 100],
  [100,  25, 100,   0,   0, 150,  50,  50, 100, 150, 100,  50],
  [150, 100,  50,   0,   0,  50, 100, 150,  50,  50, 150, 100],
];

const KEY_LEVEL = "level"
const KEY_TOWER_SELECTED = "tower_selected";

function App() {
  const [level, setLevel] = useState<string>(() => {
    const value = localStorage.getItem(KEY_LEVEL);
    return value === null ? LEVELS.keys().next().value : value;
  });

  const [towerSelected, setTowerSelected] = useState<Map<string, string>>(() => {
    const value = localStorage.getItem(KEY_TOWER_SELECTED);
    return value === null ? new Map<string, string>() : new Map<string, string>(Object.entries(JSON.parse(value)));
  });

  useEffect(() => {
    localStorage.setItem(KEY_LEVEL, level);
  }, [level]);

  useEffect(() => {
    localStorage.setItem(KEY_TOWER_SELECTED, JSON.stringify(Object.fromEntries(towerSelected)));
  }, [towerSelected]);

  return (
    <ThemeProvider
      theme={DARK_THEME}
    >
      <Box
        sx={{
          minWidth: `${(TOWERS.length + 1) * CELL_WIDTH + BORDER * 2}px`,
          display: "flex",
          justifyContent: "center",
          userSelect: "none",
        }}
      >
        <Box
          sx={{
            width: `${(TOWERS.length + 1) * CELL_WIDTH}px`,
            border: `${BORDER}px solid #888888`,
          }}
        >
          <Box>
            {Array.from({ length: ENEMIES.length + 1 }).map((_, rowIndex) => (
              <Box
                key={`${rowIndex}`}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                {Array.from({ length: TOWERS.length + 1 }).map((_, colIndex) => {
                  if (rowIndex === 0 && colIndex === 0) {
                    return (
                      <LevelCell
                        level={level}
                        setLevel={setLevel}
                      />
                    );
                  } else if (rowIndex === 0) {
                    return (
                      <TowerCell
                        level={level}
                        towerSelected={towerSelected}
                        setTowerSelected={setTowerSelected}
                        colIndex={colIndex}
                      />
                    );
                  } else if (colIndex === 0) {
                    return (
                      <EnemyCell
                        level={level}
                        rowIndex={rowIndex}
                      />
                    );
                  } else {
                    return (
                      <EffectivenessCell
                        level={level}
                        towerSelected={towerSelected}
                        rowIndex={rowIndex}
                        colIndex={colIndex}
                      />
                    );
                  }
                })}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

interface LevelCellProps {
  level: string;
  setLevel: (level: string) => void;
}

function LevelCell(props: LevelCellProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (level: string) => {
    props.setLevel(level);
    handleClose();
  };

  return (
    <Box
      key={`${0}-${0}`}
      sx={{
        width: CELL_WIDTH,
        height: CELL_HEIGHT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: CELL_WIDTH,
          height: CELL_HEIGHT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        fontSize={`${FONT_SIZE}rem`}
        fontWeight={"bold"}
        fontFamily={"monospace"}
        color={"#ffffff"}
        bgcolor={"#000000"}
        onClick={handleClick}
      >
        {props.level}
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            overflowY: "scroll",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
          },
        }}
      >
        {Array.from(LEVELS.keys()).map((level) => (
          <MenuItem
            key={level}
            onClick={() => handleSelect(level)}
            sx={{
              height: CELL_HEIGHT,
              fontSize: `${FONT_SIZE}rem`,
              fontWeight: "bold",
              fontFamily: "monospace",
            }}
          >
            {level}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

interface TowerCellProps {
  level: string;
  towerSelected: Map<string, string>;
  setTowerSelected: (towerSelected: Map<string, string>) => void;
  colIndex: number;
}

function TowerCell(props: TowerCellProps) {
  return (
    <Box
      key={`${0}-${props.colIndex}`}
      sx={{
        width: CELL_WIDTH,
        height: CELL_HEIGHT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: towerSelected(props.level, props.towerSelected, props.colIndex - 1) ? 1 : 0.2,
      }}
      bgcolor={"#222222"}
      onClick={() => {
        props.setTowerSelected(selectTower(props.level, props.towerSelected, props.colIndex - 1));
      }}
    >
      {<img
        src={`${process.env.PUBLIC_URL}/tower-${TOWERS[props.colIndex - 1]}.png`}
        width={TOWER_ICON_SIZE}
        height={TOWER_ICON_SIZE}
      />}
    </Box>
  );
}

interface EnemyCellProps {
  level: string;
  rowIndex: number;
}

function EnemyCell(props: EnemyCellProps) {
  return (
    <Box
      key={`${props.rowIndex}-${0}`}
      sx={{
        width: CELL_WIDTH,
        height: CELL_HEIGHT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: enemySelected(props.level, props.rowIndex - 1) ? 1 : 0.2,
      }}
      bgcolor={"#222222"}
    >
      {<img
        src={`${process.env.PUBLIC_URL}/enemy-type-${ENEMIES[props.rowIndex - 1]}.png`}
        width={ENEMY_ICON_SIZE}
        height={ENEMY_ICON_SIZE}
      />}
    </Box>
  );
}

interface EffectivenessCellProps {
  level: string;
  towerSelected: Map<string, string>;
  rowIndex: number;
  colIndex: number;
}

function EffectivenessCell(props: EffectivenessCellProps) {
  let color;
  let effectiveness = EFFECTIVENESS[props.colIndex - 1][props.rowIndex - 1]
  if (effectiveness > 100) {
    color = "#00ff00";
  } else if (effectiveness === 100) {
    color = "#ffff00";
  } else if (effectiveness > 0) {
    color = "#ff0000";
  } else {
    color = "#444444";
  }

  let selected = effectivenessSelected(
    props.level,
    props.towerSelected,
    props.colIndex - 1,
    props.rowIndex - 1,
  );

  return (
    <Box
      key={`${props.rowIndex}-${props.colIndex}`}
      sx={{
        width: CELL_WIDTH,
        height: CELL_HEIGHT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: selected ? 1 : 0.2,
      }}
      fontSize={`${FONT_SIZE}rem`}
      fontWeight={selected ? "bold" : "normal"}
      fontFamily={"monospace"}
      color={color}
      bgcolor={"#000000"}
    >
      {EFFECTIVENESS[props.colIndex - 1][props.rowIndex - 1]}
    </Box>
  );
}

function selectTower(
  level: string,
  towerSelected: Map<string, string>,
  towerIndex: number,
): Map<string, string> {
  const result = new Map(towerSelected);
  const split = (towerSelected.get(level) ?? "0".repeat(TOWERS.length)).split("");
  split[towerIndex] = split[towerIndex] === "0" ? "1" : "0";
  result.set(level, split.join(""));
  return result;
}

function towerSelected(
  level: string,
  towerSelected: Map<string, string>,
  towerIndex: number,
): boolean {
  return (towerSelected.get(level) ?? "0".repeat(TOWERS.length)).split("")[towerIndex] === "1";
}

function enemySelected(
  level: string,
  enemyIndex: number,
): boolean {
  return LEVELS.get(level)!.split("")[enemyIndex] === "1";
}

function effectivenessSelected(
  level: string,
  towerSelected: Map<string, string>,
  towerIndex: number,
  enemyIndex: number,
): boolean {
  return (towerSelected.get(level) ?? "0".repeat(TOWERS.length)).split("")[towerIndex] === "1" &&
    LEVELS.get(level)!.split("")[enemyIndex] === "1";
}

export default App;
