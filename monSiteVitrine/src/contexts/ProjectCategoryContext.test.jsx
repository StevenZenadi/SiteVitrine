import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProjectCategoryProvider, useProjectCategory } from '../contexts/ProjectCategoryContext';
import userEvent from '@testing-library/user-event';

const DummyComponent = () => {
  const { projectCategory, setProjectCategory } = useProjectCategory();
  return (
    <div>
      <span data-testid="category">{projectCategory}</span>
      <button onClick={() => setProjectCategory("hardware")}>Set Hardware</button>
    </div>
  );
};

describe('ProjectCategoryContext', () => {
  test('fournit la valeur par défaut "software"', () => {
    render(
      <ProjectCategoryProvider>
        <DummyComponent />
      </ProjectCategoryProvider>
    );
    expect(screen.getByTestId("category").textContent).toBe("software");
  });

  test('met à jour la valeur via setProjectCategory', async () => {
    render(
      <ProjectCategoryProvider>
        <DummyComponent />
      </ProjectCategoryProvider>
    );
    const button = screen.getByRole('button', { name: /Set Hardware/i });
    await userEvent.click(button);
    expect(screen.getByTestId("category").textContent).toBe("hardware");
  });
});
