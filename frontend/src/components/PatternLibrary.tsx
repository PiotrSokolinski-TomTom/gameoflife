import { useState } from "react";
import styled from "styled-components";
import { Button, CircularProgress } from "@mui/material";
import type { Pattern } from "../types/pattern";
import {
  useCategoryPatterns,
  useFeaturedPatterns,
} from "../hooks/usePatterns";
import { PatternCard } from "./PatternCard";

const TABS: { label: string; category: string | null }[] = [
  { label: "Featured", category: null },
  { label: "Still lifes", category: "still-lifes" },
  { label: "Oscillators", category: "oscillators" },
  { label: "Spaceships", category: "spaceships" },
];

const Panel = styled.div`
  width: 90%;
  max-width: 1000px;
  margin: 8px auto;
  background: #1e1e1e;
  border: 1px solid #444;
  border-radius: 8px;
  color: white;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
`;

const HeaderTitle = styled.span`
  font-size: 16px;
  font-weight: 600;
`;

const Tabs = styled.div`
  display: flex;
  gap: 8px;
  padding: 0 16px 8px;
  flex-wrap: wrap;
`;

const Tab = styled.button<{ $active: boolean }>`
  font-size: 13px;
  padding: 4px 12px;
  border-radius: 999px;
  border: 1px solid ${(p) => (p.$active ? "#fff" : "#555")};
  background: ${(p) => (p.$active ? "#fff" : "transparent")};
  color: ${(p) => (p.$active ? "#000" : "#ccc")};
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
  const [open, setOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const category = TABS[activeTab].category;
  const featured = useFeaturedPatterns();
  const categoryQuery = useCategoryPatterns(category);
  const query = category === null ? featured : categoryQuery;

  return (
    <Panel>
      <Header>
        <HeaderTitle>Pattern Library</HeaderTitle>
        <Button
          size="small"
          variant="outlined"
          onClick={() => setOpen((o) => !o)}
          sx={{ color: "white", borderColor: "#555" }}
        >
          {open ? "Hide" : "Show"}
        </Button>
      </Header>

      {open && (
        <>
          <Tabs>
            {TABS.map((tab, i) => (
              <Tab
                key={tab.label}
                $active={i === activeTab}
                onClick={() => setActiveTab(i)}
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
            {query.data?.length === 0 && (
              <Message>No patterns found.</Message>
            )}
            {query.data?.map((pattern) => (
              <PatternCard
                key={pattern.apgcode}
                pattern={pattern}
                onLoad={onSelect}
              />
            ))}
          </Grid>
        </>
      )}
    </Panel>
  );
}
