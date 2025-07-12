import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, GridSearchCV, LeaveOneOut
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, r2_score
import joblib

# Step 4.1: Load and Preprocess Data
def load_and_preprocess_data():
    # Simulated dataset with 10 countries (expanded for robustness)
    data = {
        'country': ['USA', 'Germany', 'China', 'Brazil', 'India', 'Japan', 'UK', 'France', 'Canada', 'Australia'],
        'gdp_growth': [2.5, 1.8, 6.0, 1.2, 5.5, 1.0, 2.0, 1.5, 2.8, 2.3],  # % annual growth
        'per_capita_income': [70000, 50000, 12000, 9000, 2500, 40000, 45000, 42000, 48000, 55000],  # USD
        'inflation_rate': [3.0, 2.0, 2.5, 8.0, 4.5, 0.5, 2.8, 2.2, 3.1, 2.7],  # %
        'internet_penetration': [90, 88, 70, 65, 50, 92, 95, 90, 93, 89],  # % population
        'ecommerce_adoption': [85, 80, 60, 55, 45, 78, 82, 79, 87, 84],  # % online sales
        '5g_coverage': [60, 50, 40, 20, 15, 70, 55, 45, 60, 65],  # % population
        'individualism': [91, 67, 20, 38, 48, 46, 89, 71, 80, 90],  # Hofstede score
        'uncertainty_avoidance': [46, 65, 30, 76, 40, 92, 35, 86, 48, 51],  # Hofstede score
        'export_volume': [2500, 1500, 3000, 300, 600, 800, 700, 600, 500, 400],  # Billion USD
        'tariff_rate': [2.0, 1.5, 3.5, 8.0, 6.0, 2.5, 1.8, 1.7, 2.2, 1.9],  # % average
        'sme_industry': ['IT', 'Manufacturing', 'IT', 'Agriculture', 'IT', 'Manufacturing', 'IT', 'Manufacturing', 'IT', 'Agriculture'],
        'market_attractiveness_score': [85, 78, 72, 65, 60, 80, 82, 79, 83, 81]  # Target (0-100)
    }
    df = pd.DataFrame(data)

    # Preprocess data
    # Handle categorical variables (sme_industry)
    df = pd.get_dummies(df, columns=['sme_industry'], drop_first=True)
    
    # Define features and target
    features = [col for col in df.columns if col not in ['country', 'market_attractiveness_score']]
    X = df[features]
    y = df['market_attractiveness_score']
    
    # Normalize numerical features
    scaler = MinMaxScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Save scaler for later use
    joblib.dump(scaler, 'scaler.pkl')
    
    return X_scaled, y, df['country'], features

# Step 4.2: Train Random Forest Model
def train_random_forest(X, y):
    # Split data into training and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42)
    
    # Determine cross-validation strategy based on training set size
    n_samples = len(X_train)
    if n_samples < 10:
        cv = LeaveOneOut()  # Use LeaveOneOut for small datasets
        cv_name = "LeaveOneOut"
    else:
        cv = min(5, n_samples)  # Use k-fold with k <= n_samples
        cv_name = f"{cv}-fold"
    
    print(f"Using {cv_name} cross-validation with {n_samples} training samples")
    
    # Initialize Random Forest Regressor
    rf = RandomForestRegressor(random_state=42)
    
    # Define hyperparameter grid for tuning
    param_grid = {
        'n_estimators': [50, 100, 200],
        'max_depth': [5, 10, None],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4]
    }
    
    # Perform Grid Search for hyperparameter tuning
    grid_search = GridSearchCV(estimator=rf, param_grid=param_grid, 
                              cv=cv, scoring='neg_mean_squared_error', n_jobs=-1)
    grid_search.fit(X_train, y_train)
    
    # Best model
    best_rf = grid_search.best_estimator_
    
    # Evaluate model
    y_pred_train = best_rf.predict(X_train)
    y_pred_test = best_rf.predict(X_test)
    
    print("Best Parameters:", grid_search.best_params_)
    print("Training R²:", r2_score(y_train, y_pred_train))
    print("Test R²:", r2_score(y_test, y_pred_test))
    print("Test MSE:", mean_squared_error(y_test, y_pred_test))
    
    return best_rf, X_test, y_test

# Step 4.3: Generate Market Rankings and Feature Importance
def generate_rankings_and_insights(model, X, countries, features):
    # Predict Market Attractiveness Scores
    scores = model.predict(X)
    
    # Create DataFrame for rankings
    rankings = pd.DataFrame({
        'Country': countries,
        'Attractiveness_Score': scores
    })
    rankings = rankings.sort_values(by='Attractiveness_Score', ascending=False).reset_index(drop=True)
    
    # Calculate confidence intervals (based on tree predictions)
    tree_predictions = np.array([tree.predict(X) for tree in model.estimators_])
    confidence_intervals = np.percentile(tree_predictions, [5, 95], axis=0)  # 90% CI
    
    rankings['Confidence_Lower'] = confidence_intervals[0]
    rankings['Confidence_Upper'] = confidence_intervals[1]
    
    # Feature importance
    importance = pd.DataFrame({
        'Feature': features,
        'Importance': model.feature_importances_
    }).sort_values(by='Importance', ascending=False)
    
    return rankings, importance

# Step 4.4: Save Model and Results
def save_results(model, rankings, importance):
    # Save model
    joblib.dump(model, 'market_attractiveness_model.pkl')
    
    # Save rankings and feature importance
    rankings.to_csv('market_rankings.csv', index=False)
    importance.to_csv('feature_importance.csv', index=False)
    
    print("Model and results saved successfully.")

# Main execution
if __name__ == "__main__":
    # Load and preprocess data
    X, y, countries, features = load_and_preprocess_data()
    
    # Train model
    model, X_test, y_test = train_random_forest(X, y)
    
    # Generate rankings and insights
    rankings, importance = generate_rankings_and_insights(model, X, countries, features)
    
    # Print results
    print("\nMarket Rankings:")
    print(rankings)
    print("\nFeature Importance:")
    print(importance)
    
    # Save results
    save_results(model, rankings, importance)
