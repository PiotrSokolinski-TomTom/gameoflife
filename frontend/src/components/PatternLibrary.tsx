import { useState } from "react";
import styled from "styled-components";
import { Button, CircularProgress } from "@mui/material";
import type { Pattern } from "../types/pattern";
import { useCategoryPatterns, useFeaturedPatterns } from "../hooks/usePatterns";
import { PatternCard } from "./PatternCard";
import { ActionButton, MaxWRow } from "./SideDrawer";

const TABS: { label: string; category: string | null }[] = [
  { label: "Featured", category: null },
  { label: "Still lifes", category: "still-lifes" },
  { label: "Oscillators", category: "oscillators" },
  { label: "Spaceships", category: "spaceships" },
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

export function PatternLibrary({
  onSelect,
}: {
  onSelect: (pattern: Pattern) => void;
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [limit, setLimit] = useState(9);
  const category = TABS[activeTab].category;
  const featured = useFeaturedPatterns();
  const categoryQuery = useCategoryPatterns(category, limit);
  const query = category === null ? featured : categoryQuery;

  return (
    <>
      <Tabs>
        {TABS.map((tab, i) => (
          <Tab
            key={tab.label}
            $active={i === activeTab}
            onClick={() => {
              setActiveTab(i);
              setLimit(9);
            }}
          >
            {tab.label}
          </Tab>
        ))}
      </Tabs>
      <Grid>
        {query.isLoading && <CircularProgress size={24} />}
        {query.isError && (
          <Message>Could not load patterns from Catagolue.</Message>
        )}
        {query.data?.length === 0 && <Message>No patterns found.</Message>}
        {query.data?.map((pattern) => (
          <PatternCard
            key={pattern.apgcode}
            pattern={pattern}
            onLoad={onSelect}
          />
        ))}
      </Grid>
      <MaxWRow>
        <ActionButton
          onClick={() => {
            setLimit(limit + 3);
          }}
        >
          Show more
        </ActionButton>
        <ActionButton
          onClick={() => {
            setLimit(limit - 3);
          }}
        >
          Show less
        </ActionButton>
      </MaxWRow>
    </>
  );
}
