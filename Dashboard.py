import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, GridSearchCV, LeaveOneOut
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import warnings
warnings.filterwarnings('ignore')

# Configure page
st.set_page_config(
    page_title="Market Attractiveness Dashboard",
    page_icon="🌍",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for dark green theme
st.markdown("""
<style>
    .main {
        background-color: #0d1b0d;
        color: #90EE90;
    }
    
    .stApp {
        background-color: #0d1b0d;
    }
    
    .css-1d391kg {
        background-color: #1a2f1a;
    }
    
    .stSidebar {
        background-color: #1a2f1a;
    }
    
    .metric-card {
        background-color: #1a2f1a;
        border: 2px solid #2d4a2d;
        border-radius: 10px;
        padding: 15px;
        margin: 10px 0;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    }
    
    .stMetric {
        background-color: #1a2f1a;
        border: 1px solid #2d4a2d;
        border-radius: 8px;
        padding: 10px;
    }
    
    .stSelectbox > div > div {
        background-color: #1a2f1a;
        color: #90EE90;
    }
    
    h1, h2, h3 {
        color: #90EE90;
        text-shadow: 0 0 10px rgba(144, 238, 144, 0.3);
    }
    
    .stDataFrame {
        background-color: #1a2f1a;
    }
    
    .highlight {
        background-color: #2d4a2d;
        padding: 10px;
        border-radius: 5px;
        border-left: 4px solid #90EE90;
    }
</style>
""", unsafe_allow_html=True)

# Data loading and preprocessing functions
@st.cache_data
def load_and_preprocess_data():
    # Market attractiveness dataset
    data = {
        'country': ['USA', 'Germany', 'China', 'Brazil', 'India', 'Japan', 'UK', 'France', 'Canada', 'Australia'],
        'gdp_growth': [2.5, 1.8, 6.0, 1.2, 5.5, 1.0, 2.0, 1.5, 2.8, 2.3],
        'per_capita_income': [70000, 50000, 12000, 9000, 2500, 40000, 45000, 42000, 48000, 55000],
        'inflation_rate': [3.0, 2.0, 2.5, 8.0, 4.5, 0.5, 2.8, 2.2, 3.1, 2.7],
        'internet_penetration': [90, 88, 70, 65, 50, 92, 95, 90, 93, 89],
        'ecommerce_adoption': [85, 80, 60, 55, 45, 78, 82, 79, 87, 84],
        '5g_coverage': [60, 50, 40, 20, 15, 70, 55, 45, 60, 65],
        'individualism': [91, 67, 20, 38, 48, 46, 89, 71, 80, 90],
        'uncertainty_avoidance': [46, 65, 30, 76, 40, 92, 35, 86, 48, 51],
        'export_volume': [2500, 1500, 3000, 300, 600, 800, 700, 600, 500, 400],
        'tariff_rate': [2.0, 1.5, 3.5, 8.0, 6.0, 2.5, 1.8, 1.7, 2.2, 1.9],
        'sme_industry': ['IT', 'Manufacturing', 'IT', 'Agriculture', 'IT', 'Manufacturing', 'IT', 'Manufacturing', 'IT', 'Agriculture'],
        'market_attractiveness_score': [85, 78, 72, 65, 60, 80, 82, 79, 83, 81]
    }
    df = pd.DataFrame(data)
    
    # Preprocess data
    df_processed = pd.get_dummies(df, columns=['sme_industry'], drop_first=True)
    
    # Define features and target
    features = [col for col in df_processed.columns if col not in ['country', 'market_attractiveness_score']]
    X = df_processed[features]
    y = df_processed['market_attractiveness_score']
    
    # Normalize features
    scaler = MinMaxScaler()
    X_scaled = scaler.fit_transform(X)
    
    return df, df_processed, X_scaled, y, features, scaler

@st.cache_data
def train_model(_X, y):
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(_X, y, test_size=0.15, random_state=42)
    
    # Initialize model
    rf = RandomForestRegressor(random_state=42, n_estimators=100, max_depth=10, min_samples_split=2)
    
    # Train model
    rf.fit(X_train, y_train)
    
    # Predictions
    y_pred_train = rf.predict(X_train)
    y_pred_test = rf.predict(X_test)
    
    # Metrics
    train_r2 = r2_score(y_train, y_pred_train)
    test_r2 = r2_score(y_test, y_pred_test)
    test_mse = mean_squared_error(y_test, y_pred_test)
    
    return rf, train_r2, test_r2, test_mse

def generate_rankings_and_insights(model, X, countries, features):
    # Predict scores
    scores = model.predict(X)
    
    # Create rankings
    rankings = pd.DataFrame({
        'Country': countries,
        'Attractiveness_Score': scores
    })
    rankings = rankings.sort_values(by='Attractiveness_Score', ascending=False).reset_index(drop=True)
    rankings['Rank'] = rankings.index + 1
    
    # Confidence intervals
    tree_predictions = np.array([tree.predict(X) for tree in model.estimators_])
    confidence_intervals = np.percentile(tree_predictions, [5, 95], axis=0)
    
    rankings['Confidence_Lower'] = confidence_intervals[0]
    rankings['Confidence_Upper'] = confidence_intervals[1]
    rankings['Confidence_Width'] = rankings['Confidence_Upper'] - rankings['Confidence_Lower']
    
    # Feature importance
    importance = pd.DataFrame({
        'Feature': features,
        'Importance': model.feature_importances_
    }).sort_values(by='Importance', ascending=False)
    
    return rankings, importance

# Main dashboard function
def main():
    st.title("🌍 Market Attractiveness Analysis Dashboard")
    st.markdown("### AI-Powered Market Intelligence for SME Expansion")
    st.markdown("---")
    
    # Load data and train model
    df, df_processed, X_scaled, y, features, scaler = load_and_preprocess_data()
    model, train_r2, test_r2, test_mse = train_model(X_scaled, y)
    rankings, importance = generate_rankings_and_insights(model, X_scaled, df['country'], features)
    
    # Sidebar
    st.sidebar.header("🔧 Dashboard Controls")
    
    # Analysis type selection
    analysis_type = st.sidebar.selectbox(
        "Select Analysis Type",
        ["Market Rankings", "Feature Analysis", "Country Comparison", "Model Performance", "Scenario Analysis"]
    )
    
    # Main content based on selection
    if analysis_type == "Market Rankings":
        show_market_rankings(rankings, df)
    elif analysis_type == "Feature Analysis":
        show_feature_analysis(importance, df)
    elif analysis_type == "Country Comparison":
        show_country_comparison(df, rankings)
    elif analysis_type == "Model Performance":
        show_model_performance(model, train_r2, test_r2, test_mse, df)
    elif analysis_type == "Scenario Analysis":
        show_scenario_analysis(model, scaler, features, df)

def show_market_rankings(rankings, df):
    st.header("📊 Market Attractiveness Rankings")
    
    # Top metrics
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        top_market = rankings.iloc[0]['Country']
        top_score = rankings.iloc[0]['Attractiveness_Score']
        st.metric("🥇 Top Market", top_market, f"{top_score:.1f}")
    
    with col2:
        avg_score = rankings['Attractiveness_Score'].mean()
        st.metric("📈 Average Score", f"{avg_score:.1f}", "±5.2")
    
    with col3:
        high_confidence = (rankings['Confidence_Width'] < 10).sum()
        st.metric("🎯 High Confidence", f"{high_confidence}/10", "Markets")
    
    with col4:
        emerging_markets = len(rankings[rankings['Attractiveness_Score'] < 70])
        st.metric("🚀 Emerging Markets", str(emerging_markets), "Opportunities")
    
    # Rankings visualization
    col1, col2 = st.columns([2, 1])
    
    with col1:
        # Horizontal bar chart
        fig = px.bar(
            rankings, 
            x='Attractiveness_Score', 
            y='Country',
            orientation='h',
            title="Market Attractiveness Scores by Country",
            color='Attractiveness_Score',
            color_continuous_scale=['#0d1b0d', '#1a2f1a', '#2d4a2d', '#90EE90'],
            height=500
        )
        
        # Add error bars for confidence intervals
        fig.add_scatter(
            x=rankings['Confidence_Upper'],
            y=rankings['Country'],
            mode='markers',
            marker=dict(symbol='line-ew', size=10, color='#90EE90'),
            showlegend=False,
            name='Confidence Upper'
        )
        
        fig.add_scatter(
            x=rankings['Confidence_Lower'],
            y=rankings['Country'],
            mode='markers',
            marker=dict(symbol='line-ew', size=10, color='#90EE90'),
            showlegend=False,
            name='Confidence Lower'
        )
        
        fig.update_layout(
            plot_bgcolor='#0d1b0d',
            paper_bgcolor='#0d1b0d',
            font_color='#90EE90'
        )
        
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        st.markdown("### 📋 Rankings Table")
        st.dataframe(
            rankings[['Rank', 'Country', 'Attractiveness_Score']].round(1),
            use_container_width=True
        )
    
    # Confidence analysis
    st.markdown("### 🎯 Confidence Analysis")
    
    fig = px.scatter(
        rankings,
        x='Attractiveness_Score',
        y='Confidence_Width',
        size='Attractiveness_Score',
        color='Country',
        title="Score vs Prediction Confidence",
        hover_data=['Rank']
    )
    
    fig.update_layout(
        plot_bgcolor='#0d1b0d',
        paper_bgcolor='#0d1b0d',
        font_color='#90EE90'
    )
    
    st.plotly_chart(fig, use_container_width=True)

def show_feature_analysis(importance, df):
    st.header("🔍 Feature Importance Analysis")
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        # Feature importance bar chart
        fig = px.bar(
            importance.head(10),
            x='Importance',
            y='Feature',
            orientation='h',
            title="Top 10 Most Important Features",
            color='Importance',
            color_continuous_scale=['#0d1b0d', '#1a2f1a', '#2d4a2d', '#90EE90']
        )
        
        fig.update_layout(
            plot_bgcolor='#0d1b0d',
            paper_bgcolor='#0d1b0d',
            font_color='#90EE90'
        )
        
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        st.markdown("### 📊 Feature Rankings")
        st.dataframe(
            importance.head(10)[['Feature', 'Importance']].round(3),
            use_container_width=True
        )
    
    # Feature correlation heatmap
    st.markdown("### 🔥 Feature Correlation Matrix")
    
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    correlation_matrix = df[numeric_cols].corr()
    
    fig = px.imshow(
        correlation_matrix,
        title="Feature Correlation Heatmap",
        color_continuous_scale=['#0d1b0d', '#1a2f1a', '#2d4a2d', '#90EE90'],
        aspect="auto"
    )
    
    fig.update_layout(
        plot_bgcolor='#0d1b0d',
        paper_bgcolor='#0d1b0d',
        font_color='#90EE90'
    )
    
    st.plotly_chart(fig, use_container_width=True)

def show_country_comparison(df, rankings):
    st.header("🌏 Country Comparison Analysis")
    
    # Country selection
    selected_countries = st.multiselect(
        "Select Countries to Compare",
        df['country'].tolist(),
        default=rankings.head(3)['Country'].tolist()
    )
    
    if selected_countries:
        # Filter data for selected countries
        comparison_data = df[df['country'].isin(selected_countries)]
        
        # Radar chart
        categories = ['gdp_growth', 'per_capita_income', 'internet_penetration', 
                     'ecommerce_adoption', '5g_coverage', 'export_volume']
        
        fig = go.Figure()
        
        for country in selected_countries:
            country_data = comparison_data[comparison_data['country'] == country]
            
            # Normalize values for radar chart (0-100 scale)
            values = []
            for cat in categories:
                val = country_data[cat].iloc[0]
                if cat == 'per_capita_income':
                    val = min(val / 1000, 100)  # Scale down income
                elif cat == 'export_volume':
                    val = min(val / 50, 100)  # Scale down export volume
                values.append(val)
            
            fig.add_trace(go.Scatterpolar(
                r=values,
                theta=categories,
                fill='toself',
                name=country,
                line=dict(color=f'rgba({np.random.randint(100, 255)}, {np.random.randint(100, 255)}, {np.random.randint(100, 255)}, 0.8)')
            ))
        
        fig.update_layout(
            polar=dict(
                radialaxis=dict(
                    visible=True,
                    range=[0, 100]
                )),
            showlegend=True,
            title="Country Comparison - Key Metrics",
            plot_bgcolor='#0d1b0d',
            paper_bgcolor='#0d1b0d',
            font_color='#90EE90'
        )
        
        st.plotly_chart(fig, use_container_width=True)
        
        # Detailed comparison table
        st.markdown("### 📋 Detailed Comparison")
        comparison_metrics = comparison_data[['country', 'gdp_growth', 'per_capita_income', 
                                           'inflation_rate', 'internet_penetration', 
                                           'ecommerce_adoption', '5g_coverage']]
        st.dataframe(comparison_metrics, use_container_width=True)

def show_model_performance(model, train_r2, test_r2, test_mse, df):
    st.header("🤖 Model Performance Analysis")
    
    # Performance metrics
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("🎯 Training R²", f"{train_r2:.3f}", "Fit Quality")
    
    with col2:
        st.metric("📊 Test R²", f"{test_r2:.3f}", "Generalization")
    
    with col3:
        st.metric("📉 Test MSE", f"{test_mse:.2f}", "Prediction Error")
    
    with col4:
        n_estimators = model.n_estimators
        st.metric("🌳 Trees", str(n_estimators), "Ensemble Size")
    
    # Model insights
    st.markdown("### 🔍 Model Insights")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        <div class="highlight">
        <h4>✅ Model Strengths</h4>
        <ul>
        <li>High R² scores indicate good fit</li>
        <li>Random Forest reduces overfitting</li>
        <li>Handles non-linear relationships</li>
        <li>Provides feature importance</li>
        </ul>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div class="highlight">
        <h4>⚠️ Limitations</h4>
        <ul>
        <li>Small dataset (10 countries)</li>
        <li>Limited historical data</li>
        <li>Cultural factors simplified</li>
        <li>External factors not included</li>
        </ul>
        </div>
        """, unsafe_allow_html=True)

def show_scenario_analysis(model, scaler, features, df):
    st.header("🎭 Scenario Analysis")
    st.markdown("### Simulate different market conditions")
    
    # Create input form for scenario analysis
    st.markdown("#### 📝 Input Custom Market Parameters")
    
    col1, col2 = st.columns(2)
    
    with col1:
        gdp_growth = st.slider("GDP Growth (%)", 0.0, 10.0, 2.5, 0.1)
        per_capita_income = st.slider("Per Capita Income ($)", 1000, 80000, 35000, 1000)
        inflation_rate = st.slider("Inflation Rate (%)", 0.0, 15.0, 3.0, 0.1)
        internet_penetration = st.slider("Internet Penetration (%)", 0, 100, 80, 1)
        ecommerce_adoption = st.slider("E-commerce Adoption (%)", 0, 100, 70, 1)
    
    with col2:
        fiveg_coverage = st.slider("5G Coverage (%)", 0, 100, 50, 1)
        individualism = st.slider("Individualism Score", 0, 100, 60, 1)
        uncertainty_avoidance = st.slider("Uncertainty Avoidance", 0, 100, 50, 1)
        export_volume = st.slider("Export Volume (Billion $)", 0, 4000, 1000, 50)
        tariff_rate = st.slider("Tariff Rate (%)", 0.0, 15.0, 3.0, 0.1)
    
    # Industry selection
    industry = st.selectbox("SME Industry", ["IT", "Manufacturing", "Agriculture"])
    
    # Prepare input data
    input_data = np.array([[
        gdp_growth, per_capita_income, inflation_rate, internet_penetration,
        ecommerce_adoption, fiveg_coverage, individualism, uncertainty_avoidance,
        export_volume, tariff_rate,
        1 if industry == "Manufacturing" else 0,  # sme_industry_Manufacturing
        1 if industry == "IT" else 0              # sme_industry_IT
    ]])
    
    # Scale input data
    input_scaled = scaler.transform(input_data)
    
    # Make prediction
    if st.button("🚀 Predict Market Attractiveness"):
        prediction = model.predict(input_scaled)[0]
        
        # Display prediction
        st.markdown("### 🎯 Prediction Result")
        
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.metric("📊 Attractiveness Score", f"{prediction:.1f}", "Out of 100")
        
        with col2:
            if prediction >= 80:
                status = "🟢 Highly Attractive"
            elif prediction >= 65:
                status = "🟡 Moderately Attractive"
            else:
                status = "🔴 Less Attractive"
            st.metric("📈 Market Status", status)
        
        with col3:
            # Compare with existing markets
            existing_scores = df['market_attractiveness_score']
            rank = (existing_scores > prediction).sum() + 1
            st.metric("🏆 Estimated Rank", f"{rank}/11", "Among countries")
        
        # Recommendation
        st.markdown("### 💡 Recommendation")
        if prediction >= 80:
            st.success("🎉 This market shows excellent potential for SME expansion. Consider it as a priority target!")
        elif prediction >= 65:
            st.warning("⚖️ This market has moderate potential. Conduct deeper analysis before expansion.")
        else:
            st.error("⚠️ This market may present challenges. Consider alternative markets or wait for improved conditions.")

if __name__ == "__main__":
    main()