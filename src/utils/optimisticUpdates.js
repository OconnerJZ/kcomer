
export const onCreate = (api, getCacheKey = () => undefined, nameOperation) => {
  return async (payload, { dispatch, queryFulfilled }) => {
    const cacheKey = getCacheKey(payload);
    const patchResult = dispatch(
      api.util.updateQueryData(nameOperation, cacheKey, (draft) => {
        draft.push(payload);
      })
    );

    try {
      const { data } = await queryFulfilled;
      dispatch(
        api.util.updateQueryData(nameOperation, cacheKey, (draft) => {
          const index = draft.findIndex((item) => item === payload);
          if (index !== -1) {
            draft[index] = data;
          }
        })
      );
    } catch {
      patchResult.undo();
    }
  };
};


export const onUpdate = (api, getCacheKey = () => undefined, nameOperation) => {
  return async ({ id, body }, { dispatch, queryFulfilled }) => {
    const cacheKey = getCacheKey({ id, body });
    const patchResult = dispatch(
      api.util.updateQueryData(nameOperation, cacheKey, (draft) => {
        const index = draft.findIndex((item) => item.id === id);
        if (index !== -1) {
          draft[index] = { ...draft[index], ...body };
        }
      })
    );

    try {
      const { data } = await queryFulfilled;
      dispatch(
        api.util.updateQueryData(nameOperation, cacheKey, (draft) => {
          const index = draft.findIndex((item) => item.id === id);
          if (index !== -1) {
            draft[index] = data;
          }
        })
      );
    } catch {
      patchResult.undo();
    }
  };
};

export const onDelete = (api, getCacheKey = () => undefined, nameOperation) => {
  return async (id, { dispatch, queryFulfilled }) => {
    const cacheKey = getCacheKey({ id });
    const patchResult = dispatch(
      api.util.updateQueryData(nameOperation, cacheKey, (draft) => {
        const index = draft.findIndex((item) => item.id === id);
        if (index !== -1) {
          draft.splice(index, 1);
        }
      })
    );

    try {
      await queryFulfilled;
    } catch {
      patchResult.undo();
    }
  };
};

export const getOptimisticUpdate = {
  onCreate,
  onUpdate,
  onDelete,
};