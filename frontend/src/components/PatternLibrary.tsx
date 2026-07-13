import { useState } from "react";
import styled from "styled-components";
import { CircularProgress } from "@mui/material";
import type { Pattern } from "../types/pattern";
import { useCategoryPatterns, useFeaturedPatterns } from "../hooks/usePatterns";
import { PatternCard } from "./PatternCard";
import { ActionButton, MaxWRow } from "./SideDrawer";

const PAGE_SIZE = 15;

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
  const category = TABS[activeTab].category;
  const featured = useFeaturedPatterns();
  const categoryQuery = useCategoryPatterns(category, offset, PAGE_SIZE);
  const query = category === null ? featured : categoryQuery;

  const patterns = category === null ? featured.data : categoryQuery.data?.patterns;
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
