const Header = ({ course }) => <h3>{course}</h3>

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part =>
        <Part key={part.id} part={part}/>
      )}
    </div>
  )
}

const Total = ({total}) => <p><b> total of {total} exercises</b></p>

const Part = ({part}) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Course = ({course}) => {
    const total = course.parts.reduce((sum, part) => sum + part.exercises, 0)
    return (
      <div>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total total={total} />
        
      </div>
    )
  }

  export default Course