import { useState } from "react";
import styled from "styled-components";
import { CircularProgress } from "@mui/material";
import type { Pattern } from "../types/pattern";
import { useCategoryPatterns, useFeaturedPatterns } from "../hooks/usePatterns";
import { PatternCard } from "./PatternCard";
import { ActionButton, MaxWRow } from "./SideDrawer";

const PAGE_SIZE = 15;

type TabDef = {
  label: string;
  category: string | null;
  classChar?: string;
  sizes?: number[];
};

const TABS: TabDef[] = [
  { label: "Featured", category: null },
  {
    label: "Still lifes",
    category: "still-lifes",
    classChar: "xs",
    sizes: [
      4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
      24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
      42, 43, 44, 45, 46, 47, 48, 50, 56,
    ],
  },
  {
    label: "Oscillators",
    category: "oscillators",
    classChar: "xp",
    sizes: [2, 3, 4, 5, 6, 8, 14, 15, 16, 24, 30, 46, 120],
  },
  {
    label: "Spaceships",
    category: "spaceships",
    classChar: "xq",
    sizes: [4, 7, 12, 16],
  },
];

const Tabs = styled.div`
  display: flex;
  gap: 8px;
  padding: 0 16px 8px;
  flex-wrap: wrap;
`;

const Tab = styled.button<{ $active: boolean }>`
  font-size: 14px;
  font-family: "Courier New", Courier, monospace;
  padding: 4px 12px;
  border-radius: 999px;
  border: 1px solid #ffffff;
  background: ${(p) => (p.$active ? "#ffffff" : "transparent")};
  color: ${(p) => (p.$active ? "#000000" : "#ffffff")};
  cursor: pointer;
`;

const Chips = styled.div`
  display: flex;
  gap: 6px;
  padding: 0 16px 8px;
  flex-wrap: wrap;
`;

const Chip = styled.button<{ $active: boolean }>`
  font-size: 12px;
  font-family: "Courier New", Courier, monospace;
  padding: 2px 10px;
  border-radius: 999px;
  border: 1px solid ${(p) => (p.$active ? "#ffffff" : "#666")};
  background: ${(p) => (p.$active ? "#ffffff" : "transparent")};
  color: ${(p) => (p.$active ? "#000000" : "#ccc")};
  cursor: pointer;
`;

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 8px 16px 16px;
  justify-content: center;
  min-height: 120px;
  align-items: center;
`;

const Message = styled.p`
  color: #aaa;
  font-size: 14px;
`;

const PageLabel = styled.span`
  color: #aaa;
  font-size: 13px;
  font-family: "Courier New", Courier, monospace;
  align-self: center;
`;

export function PatternLibrary({
  onSelect,
}: {
  onSelect: (pattern: Pattern) => void;
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [offset, setOffset] = useState(0);
  const [activePrefix, setActivePrefix] = useState<string | null>(null);
  const tab = TABS[activeTab];
  const category = tab.category;
  const featured = useFeaturedPatterns();
  const categoryQuery = useCategoryPatterns(
    category,
    offset,
    PAGE_SIZE,
    activePrefix ?? undefined,
  );
  const query = category === null ? featured : categoryQuery;

  const patterns =
    category === null ? featured.data : categoryQuery.data?.patterns;
  const hasMore = categoryQuery.data?.hasMore ?? false;

  return (
    <>
      <Tabs>
        {TABS.map((tab, i) => (
          <Tab
            key={tab.label}
            $active={i === activeTab}
            onClick={() => {
              setActiveTab(i);
              setOffset(0);
              setActivePrefix(null);
            }}
          >
            {tab.label}
          </Tab>
        ))}
      </Tabs>
      {tab.sizes && tab.classChar && (
        <Chips>
          <Chip
            $active={activePrefix === null}
            onClick={() => {
              setActivePrefix(null);
              setOffset(0);
            }}
          >
            All
          </Chip>
          {tab.sizes.map((size) => {
            const prefix = `${tab.classChar}${size}`;
            return (
              <Chip
                key={prefix}
                $active={activePrefix === prefix}
                onClick={() => {
                  setActivePrefix(prefix);
                  setOffset(0);
                }}
                title={prefix}
              >
                {size}
              </Chip>
            );
          })}
        </Chips>
      )}
      <Grid>
        {query.isLoading && <CircularProgress size={24} />}
        {query.isError && (
          <Message>Could not load patterns from Catagolue.</Message>
        )}
        {patterns?.length === 0 && <Message>No patterns found.</Message>}
        {patterns?.map((pattern) => (
          <PatternCard
            key={pattern.apgcode}
            pattern={pattern}
            onLoad={onSelect}
          />
        ))}
      </Grid>
      {category !== null && (
        <MaxWRow>
          <ActionButton
            disabled={offset === 0 || categoryQuery.isFetching}
            onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
          >
            Prev
          </ActionButton>
          <PageLabel>{Math.floor(offset / PAGE_SIZE) + 1}</PageLabel>
          <ActionButton
            disabled={!hasMore || categoryQuery.isFetching}
            onClick={() => setOffset(offset + PAGE_SIZE)}
          >
            Next
          </ActionButton>
        </MaxWRow>
      )}
    </>
  );
}
