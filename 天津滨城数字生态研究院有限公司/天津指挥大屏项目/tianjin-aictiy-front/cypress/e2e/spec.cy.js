describe('empty spec', () => {
  //1. 通过模型详情页面，回到城市概览页面，点击画圈按钮没有效果（已修复）
  it('passes', () => {
    cy.visit('/')
    cy.url().should('include','city-overview')
    cy.contains('模型库').click()
    cy.url().should('include','model-base')
    cy.contains('城市概览').click()
    cy.url().should('include','city-overview')
    cy.get('[data-cy="shou"]').click()
    cy.contains('交通出行').should('not.be.visible')
  })

})
