import React, { useState, useCallback } from 'react';
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  IconButton,
  CircularProgress,
  Typography,
  Fab,
  Zoom,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { getSavedDrinksByDate, deleteDrinksByIds } from '../api/endpoints';
import type { EditableDrink } from '../types/api';

const getTodayDate = () => new Date().toISOString().split('T')[0];

const HistoryPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: drinks,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['drinks', selectedDate],
    queryFn: () => getSavedDrinksByDate(selectedDate),
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    setSelectedIds(new Set()); // Clear selection when date changes
  };

  const handleToggleSelect = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleDeleteSingle = useCallback(
    async (id: number) => {
      setIsDeleting(true);
      try {
        await deleteDrinksByIds([id]);
        // Remove from selection if it was selected
        setSelectedIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        // Refetch the list
        await refetch();
        // Invalidate recommendations in case they were affected
        queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      } catch (error) {
        console.error('Failed to delete drink:', error);
      } finally {
        setIsDeleting(false);
      }
    },
    [refetch, queryClient]
  );

  const handleDeleteSelected = useCallback(async () => {
    if (selectedIds.size === 0) return;

    setIsDeleting(true);
    try {
      await deleteDrinksByIds(Array.from(selectedIds));
      setSelectedIds(new Set());
      await refetch();
      // Invalidate recommendations in case they were affected
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    } catch (error) {
      console.error('Failed to delete drinks:', error);
    } finally {
      setIsDeleting(false);
    }
  }, [selectedIds, refetch, queryClient]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      );
    }

    if (error) {
      return (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Typography color="error">Failed to load drinks</Typography>
        </Box>
      );
    }

    if (!drinks || drinks.length === 0) {
      return (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Typography color="text.secondary">
            No drinks recorded for this date
          </Typography>
        </Box>
      );
    }

    return (
      <List sx={{ width: '100%' }}>
        {drinks.map((drink: EditableDrink) => (
          <ListItem
            key={drink.id}
            disablePadding
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteSingle(drink.id)}
                disabled={isDeleting}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemButton
              onClick={() => handleToggleSelect(drink.id)}
              dense
              disabled={isDeleting}
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={selectedIds.has(drink.id)}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText primary={drink.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Layout title="History">
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Date Selector */}
        <TextField
          label="Date"
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          fullWidth
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: { max: getTodayDate() },
          }}
          sx={{ mb: 2 }}
        />

        {/* Drinks List */}
        {renderContent()}

        {/* Bulk Delete FAB */}
        <Zoom in={selectedIds.size > 0}>
          <Fab
            color="error"
            aria-label="delete selected"
            onClick={handleDeleteSelected}
            disabled={isDeleting}
            sx={{
              position: 'fixed',
              bottom: 80, // Above bottom navigation
              right: 16,
            }}
          >
            {isDeleting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <DeleteIcon />
            )}
          </Fab>
        </Zoom>
      </Box>
    </Layout>
  );
};

export default HistoryPage;
