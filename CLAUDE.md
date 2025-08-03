# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Sistema de Gestão de Minutas Jurídicas** (Legal Minutes Management System) - a mockup demo designed to demonstrate for prosecutors the final user experience of an automated legal minutes management system based on AI-processed case notifications, focusing on legal productivity and workflow optimization.

**Core Concept:** The system demonstrates an automated legal secretariat and advisory service that delivers classified petitions and organized data requiring only prosecutor review and approval.

## Technology Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Routing:** React Router v6
- **State Management:** React Hooks (useState, useEffect, useContext)
- **Data:** JSON mocked data (realistic API simulation)

## Project Structure

```
/
├── README.md                    # Comprehensive project documentation
├── AGENTS.md                   # Technical implementation specifications for AI
├── data-samples/               # Mock data for development and demo
│   ├── processo_sample.json    # Sample legal process data structure
│   ├── firac_sample.json       # Sample FIRAC analysis data
│   └── *.webp                  # Screenshots and visual examples
```

## System Workflow

The system workflow demonstrates a complete automation pipeline:

1. **RPA Detection:** Simple RPA detects basic case notifications
2. **RPA Data Collection:** Secondary RPA gathers comprehensive case information
3. **AI Processing:** Backend LLMs classify and organize all information
4. **Prosecutor Review:** Frontend presents organized data for validation and approval

## Key Data Structures

### Legal Process (Processo)

The core data structure based on `data-samples/processo_sample.json` includes:

- **Process Identification:** Number, court, class, subject
- **Parties:** Active and passive parties with legal representation
- **Timeline:** Chronological process movements and decisions
- **Documents:** Legal documents associated with the process
- **Notifications:** Intimations with deadlines and requirements
- **Financial Data:** Case value, costs, fees

### FIRAC Analysis

Structured legal analysis from `data-samples/firac_sample.json`:

- **Facts (Fatos):** Relevant case facts with classifications
- **Issues (Questões):** Legal questions and secondary considerations  
- **Rules (Regras):** Applicable legal provisions and regulations
- **Analysis (Análise):** Legal correlations, strengths, and vulnerabilities
- **Conclusion (Conclusão):** Strategic recommendations and required actions
- **Deadlines (Prazos):** Critical dates and urgency levels

## CRITICAL FEATURE: Process Grouping by Tags

**This is the primary and fundamental feature of the system.** With thousands of notifications arriving and being classified, the demonstration must allow prosecutors to easily view processes tagged for them or their department.

### Essential Tagging System

The system MUST demonstrate sophisticated process grouping based on:

#### 1. Responsible Department Tags
- **Fiscal:** Tax-related processes
- **Judicial:** Court proceedings and litigation
- **Administrative:** Administrative law matters
- **Health:** Public health issues
- **Environmental:** Environmental law cases
- **Patrimony:** Public asset management
- **Labor:** Employment and labor relations
- **Urban Planning:** City planning and zoning
- **Procurement:** Public contracting processes

#### 2. Complexity Level Tags
- **Simple:** Standard procedures requiring minimal analysis
- **Medium:** Cases requiring moderate legal research
- **Complex:** High-complexity cases requiring extensive analysis
- **Strategic:** Cases with significant institutional impact

#### 3. Expected Action Type Tags
- **Response Required:** Immediate response needed
- **Appeal:** Appellate procedures
- **Defense:** Defensive motions
- **Compliance:** Regulatory compliance actions
- **Monitoring:** Cases requiring ongoing supervision

#### 4. Priority and Urgency Tags
- **Critical:** Immediate attention required
- **High:** Priority cases with tight deadlines
- **Medium:** Standard processing timeline
- **Low:** Routine matters

### Prosecutor Workflow

The system must demonstrate that prosecutors can:

1. **Filter by Department:** View only processes assigned to their area
2. **Group by Tags:** Organize processes by complexity, action type, or priority
3. **Batch Review:** Validate multiple AI-generated tags simultaneously
4. **Validate Classifications:** Confirm or modify AI-generated tags
5. **Review Generated Minutes:** Approve or edit AI-drafted legal documents
6. **Final Approval:** Submit completed work with confidence

## Core Components Architecture

Based on the detailed specifications in `AGENTS.md`:

### 1. Dashboard
- Operational metrics and KPIs
- Productivity charts and trends
- Urgent deadlines monitoring
- **Department-specific filtering**
- **Tag-based process distribution**

### 2. Process List Management (PRIMARY COMPONENT)
- **AI-powered automatic classification by department**
- **Multi-dimensional tag-based filtering system**
- **Departmental assignment views**
- **Batch tag validation interface**
- Intelligent search capabilities
- Batch operations support
- Visual priority indicators

### 3. Process Detail View
- Complete case information display
- **Tag validation interface**
- Integrated FIRAC analysis presentation
- Document timeline and history
- Legal minute editor integration

### 4. AI-Powered Minutes Editor
- Automatic content generation based on FIRAC analysis
- Template-based legal document creation
- Legal validation and quality scoring
- Version control with visual diff
- Export capabilities

### 5. Smart Tagging System (CORE FEATURE)
- **Multi-category automatic classification**
- **Department assignment algorithms**
- **Complexity assessment**
- **Action type identification**
- Machine learning-based suggestions
- Configurable business rules
- Performance analytics
- **Bulk tag validation interface**

## Business Logic

### Priority Calculation
Cases are automatically prioritized based on:
- Days remaining until deadline (< 2 days = urgent)
- Case financial value (> R$ 100,000 = high priority)
- Case complexity and legal area
- Court type and jurisdiction
- **Department workload distribution**

### AI Classification System
Automatic tagging covers:
- **Responsible Department:** Based on subject matter and legal area
- **Complexity Level:** Analyzed from case content and precedents
- **Expected Action:** Inferred from case phase and requirements
- **Process Phase:** Current procedural stage
- **Financial Impact:** Value ranges and payment types
- **Urgency Level:** Deadline-based priority assignment

### Legal Minute Generation
AI-powered document creation includes:
- Template selection based on case type and court
- Automatic legal foundation insertion
- Relevant precedent integration
- Strategic argument development
- Quality assurance validation

## Development Guidelines

### Mock Data Usage
- Use real data structures from `data-samples/` as templates
- **Create realistic departmental distributions**
- **Implement diverse tag combinations**
- Maintain realistic case scenarios for demonstration
- Ensure data consistency across components
- Implement proper error handling for missing data

### Performance Considerations
- Implement lazy loading for heavy components
- Use virtualization for large lists (>100 items)
- **Optimize tag filtering performance**
- Optimize re-renders with proper React hooks usage
- Simulate realistic loading times for AI operations

### UI/UX Standards
- Follow responsive design principles (mobile-first)
- Use professional legal interface patterns
- Implement accessibility standards (WCAG 2.1 AA)
- **Maintain consistent color coding for departments and tags**
- **Provide clear visual hierarchy for tag categories**

## Key Features to Focus On

### 1. Departmental Process Views
- **Clear department-based filtering**
- **Visual tag distribution**
- **Prosecutor-specific dashboards**

### 2. Tag Validation Interface
- **Bulk tag approval/modification**
- **Confidence level indicators**
- **Easy tag reassignment**

### 3. Real-time Deadline Tracking
- Countdown timers for critical deadlines
- Visual urgency indicators
- Automatic escalation rules

### 4. AI Confidence Indicators
- Display AI classification confidence levels
- Provide explanations for AI decisions
- Allow manual override and feedback

### 5. Legal Document Quality
- Ensure generated minutes have proper legal structure
- Include relevant legal citations and precedents
- Maintain consistency with court requirements

### 6. Workflow Efficiency
- Minimize clicks between common operations
- Provide bulk actions for routine tasks
- Implement keyboard shortcuts for power users

## Demo Scenarios

The system should support demonstration of:

1. **Dashboard Overview:** Department-specific metrics and urgent cases
2. **Tag-based Process Management:** Grouping and filtering by various tags
3. **Departmental Assignment:** Viewing processes by responsible department
4. **Batch Tag Validation:** Confirming AI-generated classifications
5. **Case Processing Flow:** From notification to completed minute
6. **AI Classification:** Automatic tagging and categorization
7. **Document Generation:** Creating legal minutes with AI assistance
8. **Quality Control:** Review and approval workflows

## Value Proposition

The system demonstrates:
- **Automated Legal Secretariat:** AI handles initial classification and drafting
- **Intelligent Case Distribution:** Automatic departmental assignment
- **Efficient Review Process:** Prosecutors focus on validation, not creation
- **Scalable Processing:** Handle thousands of cases with minimal manual effort
- **Quality Assurance:** AI-powered consistency with human oversight

## Important Notes

- This is a **mockup/demo system** for concept validation
- Focus on user experience rather than full system implementation
- Real integrations (PJe, authentication, databases) are not required
- **Emphasis on demonstrating AI as automated legal assistant**
- Target audience is legal professionals (prosecutors)
- **The core value is showing AI as a smart secretariat that requires only review**

## Success Criteria

The demo should demonstrate:
- **90% automation** of initial case processing
- **80% reduction** in minute elaboration time
- **95% accuracy** in departmental assignment
- **60% less rework** through standardization
- **40% improvement** in deadline compliance
- **Seamless prosecutor workflow** from review to approval

These metrics should be visually represented in the dashboard and analytics components, with special emphasis on the tag-based organization and departmental efficiency gains.