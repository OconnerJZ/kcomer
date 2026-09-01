import PropTypes from "prop-types";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import useBusinessMenu from "@Features/menu/hooks/useBusinessMenu";
import useMenuCatalogFilters from "@Features/owner/hooks/useMenuCatalogFilters";
import useMenuItemActions from "@Features/owner/hooks/useMenuItemActions";
import useMenuItemEditor from "@Features/owner/hooks/useMenuItemEditor";
import DeleteMenuDialog from "@Features/owner/components/menu/DeleteMenuDialog";
import MenuItemDialog from "@Features/owner/components/menu/MenuItemDialog";
import MenuModifierDialog from "@Features/owner/components/menu/MenuModifierDialog";
import MenuToolbar from "@Features/owner/components/menu/MenuToolbar";
import OwnerMenuCatalog from "@Features/owner/components/menu/OwnerMenuCatalog";
import {
  EmptyMenuResults,
  EmptyMenuState,
  MenuInitialLoading,
  OwnerMenuHeader,
} from "@Features/owner/components/menu/OwnerMenuStates";

const OwnerMenu = ({ businessId, onRefresh }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const menuState = useBusinessMenu(businessId);
  const filters = useMenuCatalogFilters(menuState.menu);
  const actions = useMenuItemActions({
    deleteItem: menuState.deleteItem,
    toggleItemAvailability: menuState.toggleItemAvailability,
    onDeleted: onRefresh,
  });
  const editor = useMenuItemEditor({
    createItem: menuState.createItem,
    updateItem: menuState.updateItem,
    onSaved: onRefresh,
  });

  const hasItems = menuState.menu.length > 0;
  const customizeItem = (item) => {
    editor.closeEditor();
    actions.openModifierDialog(item);
  };

  return (
    <Box>
      <OwnerMenuHeader onCreate={() => editor.openEditor()} />

      {hasItems && (
        <MenuToolbar
          search={filters.search}
          onSearchChange={filters.setSearch}
          categories={filters.categories}
          selectedCategory={filters.category}
          onCategoryChange={filters.setCategory}
          total={menuState.menu.length}
          available={filters.availableCount}
        />
      )}

      {menuState.loading && !hasItems && <MenuInitialLoading />}
      {!menuState.loading && !hasItems && <EmptyMenuState onCreate={() => editor.openEditor()} />}
      {hasItems && filters.filteredMenu.length === 0 && <EmptyMenuResults />}

      {filters.filteredMenu.length > 0 && (
        <OwnerMenuCatalog
          items={filters.filteredMenu}
          onCustomize={actions.openModifierDialog}
          onEdit={editor.openEditor}
          onDelete={actions.requestDelete}
          onToggle={actions.toggleAvailability}
        />
      )}

      <MenuItemDialog
        open={editor.dialog.open}
        editing={Boolean(editor.dialog.item)}
        fullScreen={isSmall}
        loading={menuState.loading}
        form={editor.form}
        imagePreview={editor.imagePreview}
        onClose={editor.closeEditor}
        onSave={editor.saveItem}
        onImageChange={editor.selectImage}
        onFormChange={editor.changeField}
        onCustomize={() => customizeItem(editor.dialog.item)}
      />
      <MenuModifierDialog
        open={actions.modifierDialog.open}
        item={actions.modifierDialog.item}
        fullScreen={isSmall}
        onClose={actions.closeModifierDialog}
      />
      <DeleteMenuDialog
        open={actions.deleteDialog.open}
        loading={menuState.loading}
        onClose={actions.closeDeleteDialog}
        onConfirm={actions.confirmDelete}
      />
    </Box>
  );
};

OwnerMenu.propTypes = {
  businessId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onRefresh: PropTypes.func,
};

export default OwnerMenu;
